import shareObservable from "./shareObservable";

const delay = (t: any) => new Promise(resolve => setTimeout(resolve, t));

class CapitalizeTextSubscriber {
    public observer: any;

    public applicable(activity: any) {
      return typeof activity.text === 'string';
    }

    public async apply(activity: any) {
      // this.observer.next({
      //   ...activity,
      //   text: activity.text.toUpperCase()
      // });
      return {
        ...activity,
        text: activity.text.toUpperCase()
      };
    }

    public async next(activity: any) {
      // console.log("[CapitalizeTextSubscriber][next]");

      if (this.applicable(activity)) {
        return await this.apply(activity);
      }

      return activity;
    }
}

class BotAuthSubscriber {
    public observer: any;

    public applicable(activity: any) {
      return activity.attachments?.length && activity.attachments[0] && activity.attachments[0].contentType === 'application/vnd.microsoft.card.oauth';
    }

    public async apply(activity: any): Promise<void> {
      this.observer.next(false);
      console.log("[HIDE]");
      // await fetch("https://httpstat.us/200");
      await delay(15000);
      console.log("[SHOW]");
      return activity;
    }

    public async next(activity: any) {
      // console.log("[BotAuthSubscriber][next]");
      if (this.applicable(activity)) {
        return await this.apply(activity);
      }

      return activity;
    }
}

class DebugSubscriber {
  public observer: any;

  public applicable(activity: any) {
    return true;
  }

  public async apply(activity: any): Promise<void> {
    console.log(activity);
    return activity;
  }

  public async next(activity: any) {
    // console.log("[DebugSubscriber][next]");
    if (this.applicable(activity)) {
      return await this.apply(activity);
    }

    return activity;
  }
}

class DefaultSubscriber {
    public observer: any;

    public async next(activity: any) {
      // console.log("[DefaultSubscriber][next]");
      this.observer.next(activity);
      console.log(activity);
      return false;
    }
}

const createShimAdapter = (chatAdapter: any, subscribers: any = []) => {
    const internalSubscribers = [new CapitalizeTextSubscriber(), new BotAuthSubscriber(), new DebugSubscriber()]
    const defaultSubscribers = [new DefaultSubscriber()];
    const shimChatAdapter = {
        ...(chatAdapter as any),
        activity$: shareObservable(
          new (window as any).Observable((observer: any) => {
            const abortController = new (window as any).AbortController();

            (async () => {
              try {
                for await (let activity of (chatAdapter as any).activities({ signal: abortController.signal })) {
                  console.log("==========================");
                  console.log(activity);
                  console.log("==========================");
                  for (const subscriber of [...internalSubscribers, ...subscribers, ...defaultSubscribers]) {
                    console.log(subscriber);
                    subscriber.observer = observer;
                    activity = await subscriber.next(activity);
                    if (!activity) {
                      break;
                    }
                  }
                }
                observer.complete();
              } catch (error) {
                observer.error(error);
              }
            })();

            return () => {
              abortController.abort();
            }
          })
        )
    }

    return shimChatAdapter;
}

export default createShimAdapter;