import { ConfigurationManager } from "../../utils/transformLiveChatConfig";
import shareObservable from "./shareObservable";

class DefaultSubscriber {
    public observer: any;

    public applicable(activity: any) {
        return true;
    }

    public async next(activity: any) {
        this.observer.next(activity);
        return false;
    }
}

const useV1Chat = async (chatSDK: any) => {
    chatSDK.liveChatVersion = 1;
    chatSDK.IC3Client = await chatSDK.getIC3Client();
    chatSDK.OCClient.liveChatVersion = 1;
};

const shimChatSDK = async (chatSDK: any) => {
    console.log("[Directchat][shimChatSDK]");
    // await useV1Chat(chatSDK);
};

// const asyncSetTimeout = (fn: any, options: any) => new Promise(resolve => setTimeout(resolve(fn(options)), t));

const setOutageMessage = () => {
    const id = "Direct Chat Messaging";
    const message = "We are experiencing some technical challenges. Please close out of the chat and try again. Our apologies for the inconvenience.";
    // WebChatStates.store?.dispatch({
    //     type: "WEB_CHAT/SET_NOTIFICATION",
    //     payload: {
    //         id,
    //         level: 'error', // success, info, warn, error
    //         message
    //     }
    // });

    WebChatStates.store?.dispatch({
        type: "WEB_CHAT/SET_NOTIFICATION",
        payload: {
            id: 'foo',
            level: 'error', // success, info, warn, error
            message
        }
    });

    // WebChatStates.store?.dispatch({
    //     type: "WEB_CHAT/SET_NOTIFICATION",
    //     payload: {
    //         id: 'bar',
    //         level: 'error', // success, info, warn, error
    //         message
    //     }
    // });

    (window as any).hideSendBox();
};

const setHideSendBox = (fn: CallableFunction) => {
    (window as any).hideSendBox = fn;
}

const createChatAdapterShim = async (chatAdapter: any) => {
    console.log("[DirectChat][createChatAdapterShim]");

    const renderActivity = () => (next: any) => (activity: any) => {
        return next(activity);
    }

    const addIngress = () => (next: any) => (activity: any) => {
        activity.text = `ingress ${activity.text}`;
        return next(activity);
    }

    const addEgress = () => (next: any) => (activity: any) => {
        activity.text = `egress ${activity.text}`;
        return next(activity);
    }

    const addFoo = () => (next: any) => (activity: any) => {
        activity.text = `foo ${activity.text}`;
        return next(activity);
    }

    const addBar = () => (next: any) => (activity: any) => {
        activity.text = `bar ${activity.text}`;
        return next(activity);
    }

    const addNothing = () => (next: any) => (activity: any) => {
        console.log("[addNothing]");
        return undefined;
    }

    // Currently does not work on ingress/egress (parity with ACSAdapter still)
    const addSetTimeout = () => (next: any) => (activity: any) => {
        console.log("[addSetTimeout]");
        setTimeout(() => {
            activity.text = `setTimeout ${activity.text}`;
        }, 3000);

        return undefined;
    }

    const ingressMiddleware = [addSetTimeout, addFoo, addBar, addNothing, addIngress];
    const egressMiddleware = [addBar, addNothing, addEgress];

    chatAdapter.activity$.subscribe({
        next(activity: any) {
            console.log('[Subscriber]');
            console.log(activity);

            // const {recipient} = activity;

            // Filter out posted activities
            // if (recipient) {
            //     return activity;
            // }

            for (const middleware of [...ingressMiddleware, renderActivity]) {
                const fn = middleware()((activity: any) => activity);
                fn(activity);
            }
        }
    });

    const chatAdapterShim = {
        ...chatAdapter,
        postActivity: (activity: any) => {
            console.log("[PostActivity]");
            console.log(activity);

            for (const middleware of [...egressMiddleware, renderActivity]) {
                const fn = middleware()((activity: any) => activity);
                fn(activity);
            }

            return chatAdapter.postActivity(activity);
        }
    }

    console.log(chatAdapterShim);

    (window as any).enableOutage = () => {
        setOutageMessage();
    }

    window.addEventListener("outage", (event: any) => {
        setOutageMessage();
    }, false);

    (window as any).toggleAttachment = () => {
        console.log(ConfigurationManager.canUploadAttachment);
        const currentValue = ConfigurationManager.canUploadAttachment;
        ConfigurationManager.canUploadAttachment = !currentValue;
    }

    return chatAdapterShim;
};

const createChatAdapter = async (chatAdapter: any) => {
    console.log("[DirectChat][createChatAdapter]");
    const chatAdapterShim = await createChatAdapterShim(chatAdapter);
    return chatAdapterShim;
};

class WebChatStates {
    public static store: any;
}

export {shimChatSDK, createChatAdapter, WebChatStates, setHideSendBox};