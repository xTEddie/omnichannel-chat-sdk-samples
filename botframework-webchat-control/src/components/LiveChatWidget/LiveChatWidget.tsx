import WebChat from "../WebChat/WebChat";

interface LiveChatWidgetProps {
    omnichannelConfig?: any;
    liveChatContextKey?: string;
    left?: boolean;
}

const LiveChatWidget = (props: LiveChatWidgetProps) => {
    return (
        <>
            <WebChat left={props.left} liveChatContextKey={props.liveChatContextKey}/>
        </>
    )
}

export default LiveChatWidget;