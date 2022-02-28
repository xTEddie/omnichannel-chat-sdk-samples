export class ConfigurationManager {
    public static liveChatVersion: number = 1;
    public static canUploadAttachment: boolean = false;
    public static isPersistentChat: boolean = false;
}

const transformLiveChatConfig = (liveChatConfig: any): ConfigurationManager => {
    const liveChatVersion = (liveChatConfig as any)["LiveChatVersion"];
    const canUploadAttachment = (liveChatConfig as any)["LiveWSAndLiveChatEngJoin"]["msdyn_enablefileattachmentsforcustomers"] === "true" || false;
    const isPersistentChat = (liveChatConfig as any)["LiveWSAndLiveChatEngJoin"]["msdyn_conversationmode"] === "192350001" || false;

    ConfigurationManager.liveChatVersion = parseInt(liveChatVersion) || 1;
    ConfigurationManager.canUploadAttachment = canUploadAttachment;
    ConfigurationManager.isPersistentChat = isPersistentChat;

    return ConfigurationManager;
};

export default transformLiveChatConfig;