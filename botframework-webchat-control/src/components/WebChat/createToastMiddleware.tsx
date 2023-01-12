import CustomToast from "../CustomToast/CustomToast";

const createToastMiddleware = () => {
    console.log('[createToastMiddleware]');

    const toastMiddleware = () => (next: any) => (card: any) => {
        if (card.notification.id === 'foo') {
            console.log(card.notification);
            return <CustomToast notification={card.notification}/>
        }

        return next(card);
    }

    return toastMiddleware;
}

export default createToastMiddleware;