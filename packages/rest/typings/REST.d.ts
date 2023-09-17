/// <reference types="node" />
import * as Api from 'discord-api-types/v10';
import { APIRequest, File as FileData } from './client/APIRequest';
import { RequestManager, RequestManagerOptions, RouteLike } from './managers/RequestManager';
import { RESTClientOptions } from './client/RESTClient';
export interface RequestOptions<T = any, Q = Record<string, any>> extends Partial<Omit<APIRequest<T, Q>, 'route'>> {
    buf?: boolean;
    route?: string;
}
export interface LocalizedRequestOptions<T = any, Q = Record<string, any>> extends RequestOptions<T, Q> {
    withLocalizations?: boolean;
}
export interface WebhookRequestOptions<T = any, Q = Record<string, any>> extends Omit<RequestOptions<T, Q>, 'useAuth' | 'auth'> {
    threadId?: boolean;
}
export interface BearerAuthenticatedOptions<T = any, Q = Record<string, any>> extends Omit<RequestOptions<T, Q>, 'auth'> {
    auth: `Bearer ${string}`;
}
export interface BotRequestOptions<T = any, Q = Record<string, any>> extends Omit<RequestOptions<T, Q>, 'auth'> {
    auth?: `Bot ${string}`;
}
type File = Required<Omit<FileData, 'key'>>;
export declare class REST extends RequestManager {
    private beforeRequest;
    private afterRequest;
    constructor(token?: string | undefined, options?: RESTClientOptions, managerOptions?: RequestManagerOptions);
    set token(token: string | null);
    get token(): string | null;
    setToken(token?: string | null): this;
    getToken(): string | undefined;
    setBefore(cb: REST['beforeRequest']): this;
    setAfter(cb: REST['afterRequest']): this;
    private request;
    get<T>(route: RouteLike, options?: RequestOptions): Promise<T>;
    post<T>(route: RouteLike, options?: RequestOptions): Promise<T>;
    put<T>(route: RouteLike, options?: RequestOptions): Promise<T>;
    patch<T>(route: RouteLike, options?: RequestOptions): Promise<T>;
    delete<T>(route: RouteLike, options?: RequestOptions): Promise<T>;
    options<T>(route: RouteLike, options?: RequestOptions): Promise<T>;
    head<T>(route: RouteLike, options?: RequestOptions): Promise<T>;
    getGlobalApplicationCommands(applicationId: string, options?: LocalizedRequestOptions): Promise<Api.RESTGetAPIApplicationCommandsResult>;
    createGlobalApplicationCommand(applicationId: string, data: Api.RESTPostAPIApplicationCommandsJSONBody, options?: RequestOptions): Promise<Api.APIApplicationCommand>;
    getGlobalApplicationCommand(applicationId: string, commandId: string, options?: RequestOptions): Promise<Api.APIApplicationCommand>;
    editGlobalApplicationCommand(applicationId: string, commandId: string, data: Api.RESTPatchAPIApplicationCommandJSONBody, options?: RequestOptions): Promise<Api.APIApplicationCommand>;
    deleteGlobalApplicationCommand(applicationId: string, commandId: string, options?: RequestOptions): Promise<never>;
    bulkOverwriteGlobalApplicationCommands(applicationId: string, data: Api.RESTPutAPIApplicationCommandsJSONBody, options?: RequestOptions): Promise<Api.RESTPutAPIApplicationCommandsResult>;
    getGuildApplicationCommands(applicationId: string, guildId: string, options?: LocalizedRequestOptions): Promise<Api.RESTGetAPIApplicationCommandsResult>;
    createGuildApplicationCommand(applicationId: string, guildId: string, data: Api.RESTPostAPIApplicationCommandsJSONBody, options?: RequestOptions): Promise<Api.APIApplicationCommand>;
    getGuildApplicationCommand(applicationId: string, guildId: string, commandId: string, options?: LocalizedRequestOptions): Promise<Api.APIApplicationCommand>;
    editGuildApplicationCommand(applicationId: string, guildId: string, commandId: string, data: Api.RESTPatchAPIApplicationCommandJSONBody, options?: RequestOptions): Promise<Api.APIApplicationCommand>;
    deleteGuildApplicationCommand(applicationId: string, guildId: string, commandId: string, options?: RequestOptions): Promise<never>;
    bulkOverwriteGuildApplicationCommands(applicationId: string, guildId: string, data: Api.RESTPutAPIApplicationCommandsJSONBody, options?: RequestOptions): Promise<Api.RESTPutAPIApplicationCommandsResult>;
    bulkEditGuildApplicationCommands: (applicationId: string, guildId: string, data: Api.RESTPutAPIApplicationCommandsJSONBody, options?: RequestOptions) => Promise<Api.RESTPutAPIApplicationCommandsResult>;
    getGuildApplicationCommandPermissions(applicationId: string, guildId: string, options?: RequestOptions): Promise<Api.APIGuildApplicationCommandPermissions[]>;
    getApplicationCommandPermissions(applicationId: string, guildId: string, commandId: string, options?: RequestOptions): Promise<Api.APIGuildApplicationCommandPermissions>;
    editApplicationCommandPermissions(applicationId: string, guildId: string, commandId: string, data: Api.RESTPutAPIApplicationCommandPermissionsJSONBody, options: BearerAuthenticatedOptions): Promise<Api.APIGuildApplicationCommandPermissions>;
    createInteractionResponse(interactionId: string, token: string, data: Api.RESTPostAPIInteractionCallbackJSONBody, options?: WebhookRequestOptions): Promise<never>;
    getOriginalInteractionResponse(applicationId: string, interactionToken: string, options?: WebhookRequestOptions): Promise<Api.APIMessage>;
    editOriginalInteractionResponse(applicationId: string, interactionToken: string, data: Api.RESTPatchAPIInteractionOriginalResponseJSONBody, options?: WebhookRequestOptions): Promise<Api.APIMessage>;
    deleteOriginalInteractionResponse(applicationId: string, interactionToken: string, options?: WebhookRequestOptions): Promise<never>;
    createFollowupMessage(applicationId: string, interactionToken: string, data: Api.RESTPostAPIInteractionFollowupJSONBody, options: WebhookRequestOptions): Promise<ReturnType<REST['executeWebhook']> extends Promise<infer T | null> ? T : never>;
    getFollowupMessage(applicationId: string, interactionToken: string, messageId: string, options?: RequestOptions): Promise<Api.APIMessage>;
    editFollowupMessage(applicationId: string, interactionToken: string, messageId: string, data: Api.RESTPatchAPIInteractionFollowupJSONBody, options?: WebhookRequestOptions): Promise<Api.APIMessage>;
    deleteFollowupMessage(applicationId: string, interactionToken: string, messageId: string, options?: WebhookRequestOptions): Promise<never>;
    getApplicationRoleConnectionMetadataRecords(applicationId: string, options?: RequestOptions): Promise<Api.RESTGetAPIApplicationRoleConnectionMetadataResult>;
    updateApplicationRoleConnectionMetadataRecords(applicationId: string, data: Api.RESTPutAPIApplicationRoleConnectionMetadataJSONBody, options?: RequestOptions): Promise<Api.RESTPutAPIApplicationRoleConnectionMetadataResult>;
    getGuildAuditLog(guildId: string, options?: Api.RESTGetAPIAuditLogQuery & RequestOptions<Api.RESTGetAPIAuditLogQuery>): Promise<Api.APIAuditLog>;
    listAutoModerationRules(guildId: string, options?: RequestOptions): Promise<Api.RESTGetAPIAutoModerationRulesResult>;
    getAutoModerationRule(guildId: string, autoModerationRuleId: string, options?: RequestOptions): Promise<Api.APIAutoModerationRule>;
    createAutoModerationRule(guildId: string, data: Api.RESTPostAPIAutoModerationRuleJSONBody, options?: RequestOptions): Promise<Api.APIAutoModerationRule>;
    modifyAutoModerationRule(guildId: string, ruleId: string, data: Api.RESTPatchAPIAutoModerationRuleJSONBody, options?: RequestOptions): Promise<Api.APIAutoModerationRule>;
    deleteAutoModerationRule(guildId: string, ruleId: string, options?: RequestOptions): Promise<never>;
    getChannel(id: string, options?: RequestOptions): Promise<Api.APIChannel>;
    modifyChannel(id: string, data: Api.RESTPatchAPIChannelJSONBody, options?: RequestOptions): Promise<Api.APIChannel>;
    deleteChannel(id: string, options?: RequestOptions): Promise<Api.APIChannel>;
    closeDM: (id: string, options?: RequestOptions) => Promise<Api.APIChannel>;
    getChannelMessages(channelId: string, options: Api.RESTGetAPIChannelMessagesQuery): Promise<Api.RESTGetAPIChannelMessagesResult>;
    getChannelMessage(channelId: string, messageId: string, options?: RequestOptions): Promise<Api.APIMessage>;
    createMessage(channelId: string, data: Api.RESTPostAPIChannelMessageJSONBody, files?: File[]): Promise<Api.APIMessage>;
    crosspostMessage(channelId: string, messageId: string, options?: RequestOptions): Promise<Api.APIMessage>;
    createReaction(channelId: string, messageId: string, emoji: string, options?: RequestOptions): Promise<never>;
    deleteOwnReaction(channelId: string, messageId: string, emoji: string, options?: RequestOptions): Promise<unknown>;
    deleteUserReaction(channelId: string, messageId: string, emoji: string, userId: string, options?: RequestOptions): Promise<unknown>;
    getReactions(channelId: string, messageId: string, emoji: string, options?: Api.RESTGetAPIChannelMessageReactionUsersQuery): Promise<Api.RESTGetAPIChannelMessageReactionUsersResult>;
    deleteAllReactions(channelId: string, messageId: string, options?: RequestOptions): Promise<unknown>;
    deleteAllReactionsForEmoji(channelId: string, messageId: string, emoji: string, options?: RequestOptions): Promise<unknown>;
    editMessage(channelId: string, messageId: string, data: {
        [key in keyof Api.RESTPatchAPIChannelMessageJSONBody]: Api.RESTPatchAPIChannelMessageJSONBody[key] | null;
    }, files?: File[]): Promise<Api.APIMessage>;
    deleteMessage(channelId: string, messageId: string, options?: RequestOptions): Promise<never>;
    bulkDeleteMessages(channelId: string, messages: string[], options?: RequestOptions): Promise<never>;
    editChannelPermissions(channelId: string, overwriteId: string, data: Api.RESTPutAPIChannelPermissionJSONBody, options?: RequestOptions): Promise<never>;
    getChannelInvites(channelId: string, options?: RequestOptions): Promise<Api.RESTGetAPIChannelInvitesResult>;
    createChannelInvite(channelId: string, data: Api.RESTPostAPIChannelInviteJSONBody, options?: RequestOptions): Promise<Api.APIExtendedInvite>;
    deleteChannelPermission(channelId: string, overwriteId: string, options?: RequestOptions): Promise<never>;
    followAnnouncementChannel(channelId: string, webhookChannelId: string, options?: RequestOptions): Promise<Api.APIFollowedChannel>;
    triggerTypingIndicator(channelId: string, options?: RequestOptions): Promise<never>;
    getPinnedMessages(channelId: string, options?: RequestOptions): Promise<Api.RESTGetAPIChannelPinsResult>;
    pinMessage(channelId: string, messageId: string, options?: RequestOptions): Promise<never>;
    unpinMessage(channelId: string, messageId: string, options?: RequestOptions): Promise<never>;
    groupDMAddRecipient(channelId: string, userId: string, data: Api.RESTPutAPIChannelRecipientJSONBody, options?: RequestOptions): Promise<unknown>;
    addGroupDMRecipient: (channelId: string, userId: string, data: Api.RESTPutAPIChannelRecipientJSONBody, options?: RequestOptions) => Promise<unknown>;
    groupDMRemoveRecipient(channelId: string, userId: string, options?: RequestOptions): Promise<unknown>;
    removeGroupDMRecipient: (channelId: string, userId: string, options?: RequestOptions) => Promise<unknown>;
    startThreadFromMessage(channelId: string, messageId: string, data: Api.RESTPostAPIChannelMessagesThreadsJSONBody, options?: RequestOptions): Promise<Api.APIChannel>;
    startThreadWithoutMessage(channelId: string, data: Api.RESTPostAPIChannelThreadsJSONBody, options?: RequestOptions): Promise<Api.APIChannel>;
    startThread: (channelId: string, data: Api.RESTPostAPIChannelThreadsJSONBody, options?: RequestOptions) => Promise<Api.APIChannel>;
    startThreadInForumChannel(channelId: string, data: Api.RESTPostAPIGuildForumThreadsJSONBody, options?: {
        reason?: string;
        files?: File[];
    }): Promise<Api.RESTPostAPIGuildForumThreadsJSONBody>;
    joinThread(channelId: string, options?: RequestOptions): Promise<never>;
    addThreadMember(channelId: string, userId: string, options?: RequestOptions): Promise<never>;
    leaveThread(channelId: string, options?: RequestOptions): Promise<never>;
    removeThreadMember(channelId: string, userId: string, options?: RequestOptions): Promise<never>;
    getThreadMember(channelId: string, userId: string, options?: {
        with_member?: boolean;
    }): Promise<Api.RESTGetAPIChannelThreadMembersResult>;
    listThreadMembers(channelId: string, options?: Api.RESTGetAPIChannelThreadMembersQuery): Promise<Api.RESTGetAPIChannelThreadMembersResult>;
    listPublicArchivedThreads(channelId: string, options?: Api.RESTGetAPIChannelThreadsArchivedQuery): Promise<Api.RESTGetAPIChannelUsersThreadsArchivedResult>;
    listPrivateArchivedThreads(channelId: string, options?: Api.RESTGetAPIChannelThreadsArchivedQuery): Promise<Api.APIThreadList>;
    listJoinedPrivateArchivedThreads(channelId: string, options?: Api.RESTGetAPIChannelThreadsArchivedQuery): Promise<Api.RESTGetAPIChannelUsersThreadsArchivedResult>;
    listGuildEmojis(guildId: string, options?: RequestOptions): Promise<Api.RESTGetAPIGuildEmojisResult>;
    getGuildEmoji(guildId: string, emojiId: string, options?: RequestOptions): Promise<Api.APIEmoji>;
    createGuildEmoji(guildId: string, data: {
        name: string;
        imageData: File;
        roles?: string[];
    }, options?: RequestOptions): Promise<Api.APIEmoji>;
    modifyGuildEmoji(guildId: string, emojiId: string, data: Api.RESTPatchAPIGuildEmojiJSONBody, options?: RequestOptions): Promise<Api.APIEmoji>;
    deleteGuildEmoji(guildId: string, emojiId: string, options?: RequestOptions): Promise<never>;
    createGuild(data: Api.RESTPostAPIGuildsJSONBody, options?: RequestOptions): Promise<Api.APIGuild>;
    getGuild(guildId: string, options?: {
        with_counts?: boolean;
    }): Promise<Api.APIGuild>;
    getGuildPreview(guildId: string, options?: RequestOptions): Promise<Api.APIGuildPreview>;
    modifyGuild(guildId: string, data: Api.RESTPatchAPIGuildJSONBody, options?: RequestOptions): Promise<Api.APIGuild>;
    editGuild: (guildId: string, data: Api.RESTPatchAPIGuildJSONBody, options?: RequestOptions) => Promise<Api.APIGuild>;
    deleteGuild(guildId: string, options?: RequestOptions): Promise<never>;
    getGuildChannels(guildId: string, options?: RequestOptions): Promise<Api.RESTGetAPIGuildChannelsResult>;
    createGuildChannel(guildId: string, data: Api.RESTPostAPIGuildChannelJSONBody, options?: RequestOptions): Promise<Api.APIChannel>;
    modifyGuildChannelPositions(guildId: string, data: Api.RESTPatchAPIGuildChannelPositionsJSONBody, options?: RequestOptions): Promise<never>;
    getGuildMember(guildId: string, userId: string, options?: RequestOptions): Promise<Api.APIGuildMember>;
    listGuildMembers(guildId: string, options?: Api.RESTGetAPIGuildMembersQuery & RequestOptions<never, Api.RESTGetAPIGuildMembersQuery>): Promise<Api.RESTGetAPIGuildMembersResult>;
    searchGuildMembers(guildId: string, query: string, options?: RequestOptions & {
        limit?: number;
    }): Promise<Api.RESTGetAPIGuildMembersResult>;
    addGuildMember(guildId: string, userId: string, accessToken: string, data?: Omit<Api.RESTPutAPIGuildMemberJSONBody, 'access_token'>, options?: BotRequestOptions): Promise<Api.RESTPutAPIGuildMemberResult>;
    modifyGuildMember(guildId: string, userId: string, data: Api.RESTPatchAPIGuildMemberJSONBody, options?: RequestOptions): Promise<Api.APIGuildMember>;
    modifyCurrentMember(guildId: string, nickname?: string, options?: RequestOptions): Promise<Api.APIGuildMember>;
    editCurrentUserNick(guildId: string, nickname?: string, options?: RequestOptions): Promise<Api.APIGuildMember>;
    addGuildMemberRole(guildId: string, userId: string, roleId: string, options?: RequestOptions): Promise<never>;
    removeGuildMemberRole(guildId: string, userId: string, roleId: string, options?: RequestOptions): Promise<never>;
    removeGuildMember(guildId: string, userId: string, options?: RequestOptions): Promise<never>;
    getGuildBans(guildId: string, options?: Api.RESTGetAPIGuildBansQuery): Promise<Api.RESTGetAPIGuildBansResult>;
    getGuildBan(guildId: string, userId: string, options?: RequestOptions): Promise<Api.APIBan>;
    createGuildBan(guildId: string, userId: string, data: Api.RESTPutAPIGuildBanJSONBody, options?: RequestOptions): Promise<never>;
    removeGuildBan(guildId: string, userId: string, options?: RequestOptions): Promise<never>;
    getGuildRoles(guildId: string, options?: RequestOptions): Promise<Api.RESTGetAPIGuildRolesResult>;
    createGuildRole(guildId: string, data: Api.RESTPostAPIGuildRoleJSONBody & {
        icon: Omit<File, 'filename' | 'key'> | string;
    }, options?: RequestOptions): Promise<Api.APIRole>;
    editGuildRolePositions(guildId: string, data: Api.RESTPatchAPIGuildRolePositionsJSONBody, options?: RequestOptions): Promise<Api.RESTPatchAPIGuildRolePositionsResult>;
    editGuildRole(guildId: string, roleId: string, data: Api.RESTPatchAPIGuildRoleJSONBody, options?: RequestOptions): Promise<Api.APIRole>;
    deleteGuildRole(guildId: string, roleId: string, options?: RequestOptions): Promise<never>;
    getGuildPruneCount(guildId: string, options?: Api.RESTGetAPIGuildPruneCountQuery): Promise<Api.RESTGetAPIGuildPruneCountResult>;
    startGuildPrune(guildId: string, data?: Api.RESTPostAPIGuildPruneJSONBody, options?: RequestOptions): Promise<Api.RESTPostAPIGuildPruneResult>;
    getGuildVoiceRegions(guildId: string, options?: RequestOptions): Promise<Api.RESTGetAPIGuildVoiceRegionsResult>;
    getGuildInvites(guildId: string, options?: RequestOptions): Promise<Api.RESTGetAPIGuildInvitesResult>;
    getGuildIntegrations(guildId: string, options?: RequestOptions): Promise<Api.RESTGetAPIGuildIntegrationsResult>;
    deleteGuildIntegration(guildId: string, integrationId: string, options?: RequestOptions): Promise<never>;
    getGuildWidgetSettings(guildId: string, options?: RequestOptions): Promise<Api.APIGuildWidgetSettings>;
    editGuildWidgetSettings(guildId: string, data: Api.RESTPatchAPIGuildWidgetSettingsJSONBody, options?: RequestOptions): Promise<Api.APIGuildWidgetSettings>;
    getGuildWidgetData(guildId: string, options?: RequestOptions): Promise<Api.APIGuildWidget>;
    getGuildVanity(guildId: string, options?: RequestOptions): Promise<Api.RESTGetAPIGuildVanityUrlResult>;
    getGuildWidgetImage(guildId: string, style: Api.GuildWidgetStyle): Promise<Buffer>;
    getGuildWelcomeScreen(guildId: string, options?: RequestOptions): Promise<Api.APIGuildWelcomeScreen>;
    editGuildWelcomeScreen(guildId: string, data: Api.RESTPatchAPIGuildWelcomeScreenJSONBody, options?: RequestOptions): Promise<Api.APIGuildWelcomeScreen>;
    editUserVoiceState(guildId: string, userId: string, data: Api.RESTPatchAPIGuildVoiceStateUserJSONBody & {
        request_to_speak_timestamp?: string;
    }, options?: RequestOptions): Promise<never>;
    editCurrentUserVoiceState(guildId: string, data: Api.RESTPatchAPIGuildVoiceStateCurrentMemberJSONBody, options?: RequestOptions): Promise<never>;
    listGuildScheduledEvents(guildId: string, withUserCount?: boolean): Promise<Api.RESTGetAPIGuildScheduledEventsResult>;
    createGuildScheduledEvent(guildId: string, data: Omit<Api.RESTPostAPIGuildScheduledEventJSONBody, 'image'>, options?: {
        image?: File;
        reason?: string;
    } & RequestOptions): Promise<Api.APIGuildScheduledEvent>;
    getGuildScheduledEvent(guildId: string, scheduledEventId: string, withUserCount?: boolean): Promise<Api.APIGuildScheduledEvent>;
    editGuildScheduledEvent(guildId: string, scheduledEventId: string, data: Omit<Api.RESTPatchAPIGuildScheduledEventJSONBody, 'image'>, options?: {
        image?: File;
        reason?: string;
    } & RequestOptions): Promise<Api.APIGuildScheduledEvent>;
    deleteGuildScheduledEvent(guildId: string, scheduledEventId: string, options?: RequestOptions): Promise<never>;
    getGuildScheduledEventUsers(guildId: string, scheduledEventId: string, options: Api.RESTGetAPIGuildScheduledEventUsersQuery): Promise<Api.RESTGetAPIGuildScheduledEventUsersResult>;
    getGuildTemplate(code: string, options?: RequestOptions): Promise<Api.APITemplate>;
    createGuildFromTemplate(code: string, data: {
        name: string;
        icon: File;
    }): Promise<Api.APIGuild>;
    getGuildTemplates(guildId: string, options?: RequestOptions): Promise<Api.RESTGetAPIGuildTemplatesResult>;
    createGuildTemplate(guildId: string, data: Api.RESTPostAPIGuildTemplatesJSONBody, options?: RequestOptions): Promise<Api.APITemplate>;
    syncGuildTemplate(guildId: string, code: string, options?: RequestOptions): Promise<Api.APITemplate>;
    editGuildTemplate(guildId: string, code: string, data: Api.RESTPatchAPIGuildTemplateJSONBody, options?: RequestOptions): Promise<Api.APITemplate>;
    deleteGuildTemplate(guildId: string, code: string, options?: RequestOptions): Promise<Api.APITemplate>;
    getInvite(code: string, options?: Api.RESTGetAPIInviteQuery): Promise<Api.APIInvite>;
    deleteInvite(code: string, options?: RequestOptions): Promise<Api.APIInvite>;
    createStageInstance(channelId: string, data: Omit<Api.RESTPostAPIStageInstanceJSONBody, 'channel_id'>, options?: RequestOptions): Promise<Api.APIStageInstance>;
    getStageInstance(channelId: string, options?: RequestOptions): Promise<Api.APIStageInstance>;
    editStageInstance(channelId: string, data: Api.RESTPatchAPIStageInstanceJSONBody, options?: RequestOptions): Promise<Api.APIStageInstance>;
    deleteStageInstance(channelId: string, options?: RequestOptions): Promise<never>;
    getSticker(stickerId: string, options?: RequestOptions): Promise<Api.APISticker>;
    listPremiumStickerPacks(options?: RequestOptions): Promise<Api.RESTGetStickerPacksResult>;
    listGuildStickers(guildId: string, options?: RequestOptions): Promise<Api.RESTGetAPIGuildStickersResult>;
    getGuildSticker(guildId: string, stickerId: string, options?: RequestOptions): Promise<Api.APISticker>;
    createGuildSticker(guildId: string, data: Omit<Api.RESTPostAPIGuildStickerFormDataBody, 'file'>, image: File, options?: RequestOptions): Promise<Api.APISticker>;
    editGuildSticker(guildId: string, stickerId: string, data: Api.RESTPatchAPIGuildStickerJSONBody, options?: RequestOptions): Promise<Api.APISticker>;
    deleteGuildSticker(guildId: string, stickerId: string, options?: RequestOptions): Promise<never>;
    getCurrentUser(options?: RequestOptions): Promise<Api.APIUser>;
    getUser(userId: string, options?: RequestOptions): Promise<Api.APIUser>;
    editCurrentUser(data: Api.RESTPatchAPICurrentUserJSONBody, options?: RequestOptions): Promise<Api.APIUser>;
    getCurrentUserGuilds(options?: Api.RESTGetAPICurrentUserGuildsQuery): Promise<Api.RESTGetAPICurrentUserGuildsResult>;
    getCurrentGuildMember(guildId: string, options?: RequestOptions): Promise<Api.APIGuildMember>;
    leaveGuild(guildId: string, options?: RequestOptions): Promise<never>;
    createDM(recipientId: string, options?: RequestOptions): Promise<Api.APIChannel>;
    createGroupDM(accessTokens: string[], nicks?: Record<string, string>): Promise<Api.APIChannel>;
    getUserConnections(userId: string, options?: RequestOptions): Promise<Api.APIConnection>;
    listVoiceRegions(options?: RequestOptions): Promise<Api.APIVoiceRegion[]>;
    createWebhook(channelId: string, data: Api.RESTPostAPIChannelWebhookJSONBody, options?: RequestOptions): Promise<Api.APIWebhook>;
    getChannelWebhooks(channelId: string, options?: RequestOptions): Promise<Api.APIWebhook[]>;
    getGuildWebhooks(guildId: string, options?: RequestOptions): Promise<Api.APIWebhook[]>;
    getWebhook(webhookId: string, options?: RequestOptions): Promise<Api.APIWebhook>;
    getWebhookWithToken(webhookId: string, token: string, options?: RequestOptions): Promise<Api.APIWebhook>;
    editWebhook(webhookId: string, data: Api.RESTPatchAPIWebhookJSONBody, options?: RequestOptions): Promise<Api.APIWebhook>;
    editWebhookWithToken(webhookId: string, token: string, data: Omit<Api.RESTPatchAPIWebhookJSONBody, 'channel_id'>, options?: RequestOptions): Promise<Omit<Api.APIWebhook, "user">>;
    deleteWebhook(webhookId: string, options?: RequestOptions): Promise<never>;
    deleteWebhookWithToken(webhookId: string, token: string, options?: RequestOptions): Promise<never>;
    executeWebhook<T = Api.RESTPostAPIWebhookWithTokenJSONBody>(webhookId: string, token: string, data: T, options?: WebhookRequestOptions<T, Api.RESTPostAPIWebhookWithTokenQuery> & {
        compat?: string;
    }, compat?: string): Promise<Api.APIMessage | null>;
    createWebhookMessage(webhookId: string, token: string, data: Api.RESTPostAPIWebhookWithTokenJSONBody, options?: RequestOptions<Api.RESTPostAPIWebhookWithTokenJSONBody, Api.RESTPostAPIWebhookWithTokenQuery>): Promise<Api.APIMessage | null>;
    executeWebhookSlack(webhookId: string, token: string, data: any, options?: RequestOptions<any, Api.RESTPostAPIWebhookWithTokenSlackQuery>): Promise<Api.APIMessage | null>;
    executeWebhookGitHub(webhookId: string, token: string, data: any, options?: RequestOptions<any, Api.RESTPostAPIWebhookWithTokenGitHubQuery>): Promise<Api.APIMessage | null>;
    getWebhookMessage(webhookId: string, token: string, messageId: string, options?: WebhookRequestOptions): Promise<Api.APIMessage>;
    editWebhookMessage(webhookId: string, token: string, messageId: string, data: Api.RESTPatchAPIWebhookWithTokenMessageJSONBody, options?: WebhookRequestOptions): Promise<Api.APIMessage>;
    deleteWebhookMessage(webhookId: string, token: string, messageId: string, options?: WebhookRequestOptions): Promise<never>;
    getGateway(options?: RequestOptions): Promise<Api.APIGatewayInfo>;
    getGatewayBot(options?: RequestOptions): Promise<Api.APIGatewayBotInfo>;
    getCurrentOAuth2Authorization(options?: RequestOptions): Promise<Api.RESTGetAPIOAuth2CurrentAuthorizationResult>;
    getCurrentBotApplication(options?: RequestOptions): Promise<Api.RESTGetAPIOAuth2CurrentApplicationResult>;
}
export {};
