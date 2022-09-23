import WebChat from "../WebChat/WebChat";

interface LiveChatWidgetProps {
    omnichannelConfig?: any;
    left?: boolean;
}

const LiveChatWidget = (props: LiveChatWidgetProps) => {
    return (
        <>
            <WebChat left={props.left} />
        </>
    )
}

export default LiveChatWidget;