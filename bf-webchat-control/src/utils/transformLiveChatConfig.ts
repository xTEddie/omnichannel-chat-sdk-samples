export class ConfigurationManager {
    public static liveChatVersion: number = 1;
    public static canUploadAttachment: boolean = false;
    public static isPersistentChat: boolean = false;
    public static isChatReconnect: boolean = false;
}

const transformLiveChatConfig = (liveChatConfig: any): ConfigurationManager => {
    const liveWSAndLiveChatEngJoin = (liveChatConfig as any)["LiveWSAndLiveChatEngJoin"];

    const liveChatVersion = (liveChatConfig as any)["LiveChatVersion"];
    const canUploadAttachment = liveWSAndLiveChatEngJoin["msdyn_enablefileattachmentsforcustomers"] === "true" || false;
    const isPersistentChat = liveWSAndLiveChatEngJoin["msdyn_conversationmode"] === "192350001" || false;
    const isChatReconnect = (liveWSAndLiveChatEngJoin["msdyn_conversationmode"] === "192350000" && liveWSAndLiveChatEngJoin["msdyn_enablechatreconnect"] === "true") || false

    ConfigurationManager.liveChatVersion = parseInt(liveChatVersion) || 1;
    ConfigurationManager.canUploadAttachment = canUploadAttachment;
    ConfigurationManager.isPersistentChat = isPersistentChat;
    ConfigurationManager.isChatReconnect = isChatReconnect;

    return ConfigurationManager;
};

export default transformLiveChatConfig;