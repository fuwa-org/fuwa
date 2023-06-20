import {
  APIChannel,
  APIConnection,
  APIGuild,
  APIGuildMember,
  APITemplate,
  APIThreadList,
  APIVoiceRegion,
  APIWebhook,
  GuildWidgetStyle,
  Locale,
  RESTDeleteAPIChannelMessageResult,
  RESTDeleteAPIChannelPermissionResult,
  RESTDeleteAPIChannelPinResult,
  RESTDeleteAPIChannelRecipientResult,
  RESTDeleteAPIChannelResult,
  RESTDeleteAPIChannelThreadMembersResult,
  RESTDeleteAPICurrentUserGuildResult,
  RESTDeleteAPIGuildBanResult,
  RESTDeleteAPIGuildEmojiResult,
  RESTDeleteAPIGuildIntegrationResult,
  RESTDeleteAPIGuildMemberResult,
  RESTDeleteAPIGuildMemberRoleResult,
  RESTDeleteAPIGuildResult,
  RESTDeleteAPIGuildRoleResult,
  RESTDeleteAPIGuildScheduledEventResult,
  RESTDeleteAPIGuildStickerResult,
  RESTDeleteAPIInviteResult,
  RESTDeleteAPIStageInstanceResult,
  RESTDeleteAPIWebhookResult,
  RESTDeleteAPIWebhookWithTokenMessageResult,
  RESTGetAPIApplicationCommandPermissionsResult,
  RESTGetAPIApplicationCommandResult,
  RESTGetAPIApplicationCommandsResult,
  RESTGetAPIAuditLogQuery,
  RESTGetAPIAuditLogResult,
  RESTGetAPIChannelInvitesResult,
  RESTGetAPIChannelMessageReactionUsersQuery,
  RESTGetAPIChannelMessageReactionUsersResult,
  RESTGetAPIChannelMessageResult,
  RESTGetAPIChannelMessagesQuery,
  RESTGetAPIChannelMessagesResult,
  RESTGetAPIChannelPinsResult,
  RESTGetAPIChannelResult,
  RESTGetAPIChannelThreadMembersResult,
  RESTGetAPIChannelThreadsArchivedQuery,
  RESTGetAPICurrentUserGuildsQuery,
  RESTGetAPICurrentUserGuildsResult,
  RESTGetAPICurrentUserResult,
  RESTGetAPIGatewayBotResult,
  RESTGetAPIGatewayResult,
  RESTGetAPIGuildBanResult,
  RESTGetAPIGuildBansQuery,
  RESTGetAPIGuildBansResult,
  RESTGetAPIGuildChannelsResult,
  RESTGetAPIGuildEmojiResult,
  RESTGetAPIGuildEmojisResult,
  RESTGetAPIGuildIntegrationsResult,
  RESTGetAPIGuildInvitesResult,
  RESTGetAPIGuildMemberResult,
  RESTGetAPIGuildMembersQuery,
  RESTGetAPIGuildMembersResult,
  RESTGetAPIGuildPreviewResult,
  RESTGetAPIGuildPruneCountQuery,
  RESTGetAPIGuildPruneCountResult,
  RESTGetAPIGuildResult,
  RESTGetAPIGuildRolesResult,
  RESTGetAPIGuildScheduledEventResult,
  RESTGetAPIGuildScheduledEventsResult,
  RESTGetAPIGuildScheduledEventUsersQuery,
  RESTGetAPIGuildScheduledEventUsersResult,
  RESTGetAPIGuildStickerResult,
  RESTGetAPIGuildStickersResult,
  RESTGetAPIGuildTemplatesResult,
  RESTGetAPIGuildVanityUrlResult,
  RESTGetAPIGuildVoiceRegionsResult,
  RESTGetAPIGuildWelcomeScreenResult,
  APIGuildWidget as RESTGetAPIGuildWidgetResult,
  RESTGetAPIGuildWidgetSettingsResult,
  RESTGetAPIInviteQuery,
  RESTGetAPIInviteResult,
  RESTGetAPIOAuth2CurrentApplicationResult,
  RESTGetAPIOAuth2CurrentAuthorizationResult,
  RESTGetAPIStageInstanceResult,
  RESTGetAPIStickerResult,
  RESTGetAPIUserResult,
  RESTGetAPIWebhookWithTokenMessageResult,
  RESTGetNitroStickerPacksResult,
  RESTPatchAPIApplicationCommandJSONBody,
  RESTPatchAPIApplicationCommandResult,
  RESTPatchAPIChannelJSONBody,
  RESTPatchAPIChannelMessageJSONBody,
  RESTPatchAPIChannelMessageResult,
  RESTPatchAPIChannelResult,
  RESTPatchAPICurrentUserJSONBody,
  RESTPatchAPICurrentUserResult,
  RESTPatchAPIGuildChannelPositionsJSONBody,
  RESTPatchAPIGuildChannelPositionsResult,
  RESTPatchAPIGuildEmojiJSONBody,
  RESTPatchAPIGuildEmojiResult,
  RESTPatchAPIGuildJSONBody,
  RESTPatchAPIGuildMemberJSONBody,
  RESTPatchAPIGuildMemberResult,
  RESTPatchAPIGuildResult,
  RESTPatchAPIGuildRoleJSONBody,
  RESTPatchAPIGuildRolePositionsJSONBody,
  RESTPatchAPIGuildRolePositionsResult,
  RESTPatchAPIGuildRoleResult,
  RESTPatchAPIGuildScheduledEventJSONBody,
  RESTPatchAPIGuildScheduledEventResult,
  RESTPatchAPIGuildStickerJSONBody,
  RESTPatchAPIGuildStickerResult,
  RESTPatchAPIGuildVoiceStateCurrentMemberJSONBody,
  RESTPatchAPIGuildVoiceStateUserJSONBody,
  RESTPatchAPIGuildWelcomeScreenJSONBody,
  RESTPatchAPIGuildWidgetSettingsJSONBody,
  RESTPatchAPIGuildWidgetSettingsResult,
  RESTPatchAPIInteractionFollowupJSONBody,
  RESTPatchAPIInteractionOriginalResponseJSONBody,
  RESTPatchAPIStageInstanceJSONBody,
  RESTPatchAPIStageInstanceResult,
  RESTPatchAPIWebhookJSONBody,
  RESTPatchAPIWebhookResult,
  RESTPatchAPIWebhookWithTokenMessageJSONBody,
  RESTPatchAPIWebhookWithTokenMessageResult,
  RESTPostAPIApplicationCommandsJSONBody,
  RESTPostAPIApplicationCommandsResult,
  RESTPostAPIChannelFollowersResult,
  RESTPostAPIChannelInviteJSONBody,
  RESTPostAPIChannelInviteResult,
  RESTPostAPIChannelMessageCrosspostResult,
  RESTPostAPIChannelMessageJSONBody,
  RESTPostAPIChannelMessageResult,
  RESTPostAPIChannelMessagesBulkDeleteResult,
  RESTPostAPIChannelMessagesThreadsJSONBody,
  RESTPostAPIChannelMessagesThreadsResult,
  RESTPostAPIChannelThreadsJSONBody,
  RESTPostAPIChannelThreadsResult,
  RESTPostAPIChannelTypingResult,
  RESTPostAPIChannelWebhookJSONBody,
  RESTPostAPIChannelWebhookResult,
  RESTPostAPIGuildChannelJSONBody,
  RESTPostAPIGuildChannelResult,
  RESTPostAPIGuildEmojiResult,
  RESTPostAPIGuildForumThreadsJSONBody,
  RESTPostAPIGuildPruneJSONBody,
  RESTPostAPIGuildPruneResult,
  RESTPostAPIGuildRoleJSONBody,
  RESTPostAPIGuildRoleResult,
  RESTPostAPIGuildScheduledEventJSONBody,
  RESTPostAPIGuildScheduledEventResult,
  RESTPostAPIGuildStickerFormDataBody,
  RESTPostAPIGuildStickerResult,
  RESTPostAPIInteractionCallbackJSONBody,
  RESTPostAPIInteractionFollowupJSONBody,
  RESTPostAPIStageInstanceJSONBody,
  RESTPostAPIStageInstanceResult,
  RESTPostAPIWebhookWithTokenJSONBody,
  RESTPostAPIWebhookWithTokenQuery,
  RESTPostAPIWebhookWithTokenWaitResult,
  RESTPutAPIApplicationCommandsJSONBody,
  RESTPutAPIApplicationCommandsResult,
  RESTPutAPIChannelMessageReactionResult,
  RESTPutAPIChannelPermissionJSONBody,
  RESTPutAPIChannelPermissionResult,
  RESTPutAPIChannelPinResult,
  RESTPutAPIChannelRecipientResult,
  RESTPutAPIChannelThreadMembersResult,
  RESTPutAPIGuildBanJSONBody,
  RESTPutAPIGuildBanResult,
  RESTPutAPIGuildMemberJSONBody,
  RESTPutAPIGuildMemberResult,
  RESTPutAPIGuildMemberRoleResult,
} from 'discord-api-types/v10';
import Dispatcher from 'undici/types/dispatcher';

import { APIRequest, File as FileData } from './APIRequest.js';
import { DefaultDiscordOptions } from './index.js';
import {
  RequestManager,
  RequestManagerOptions,
  RouteLike,
} from './RequestManager.js';
import { RESTClient, RESTClientOptions } from './RESTClient.js';
import { createDataURL as createDataURI } from './util.js';

type RequestOptions = Partial<APIRequest & { buf: boolean }>;
type Awaitable<T> = Promise<T> | T;
type File = Required<Omit<FileData, 'filename' | 'key'>>;

/**
 * A simple, typed yet unsafe at runtime REST wrapper for Discord,
 * exposing the documented endpoints in a type-safe way.
 */
export class REST extends RequestManager {
  beforeRequest:
    | ((options: RequestOptions) => Awaitable<void | RequestOptions>)
    | undefined = undefined;
  afterRequest:
    | ((
        options: RequestOptions,
        response: Dispatcher.ResponseData,
        text: string,
        json: any | null,
      ) => Awaitable<void>)
    | undefined = undefined;

  constructor(
    token: string | undefined = process.env.DISCORD_TOKEN,
    options: RESTClientOptions = DefaultDiscordOptions,
    managerOptions: RequestManagerOptions = {},
  ) {
    Object.assign(options, DefaultDiscordOptions);

    options.auth = token;

    super(new RESTClient(options), managerOptions);
  }

  /**
   * Set or gets the authentication token for requests to use. Tokens require a
   * token type, must be `Bot` or `Bearer`.
   * @returns The REST client instance if the token was set, otherwise the
   *     current token.
   */
  token(token?: string | null) {
    if (token) {
      this.client.setAuth(token);
    }

    if (token === null) {
      this.client.setAuth(undefined);
    }

    return token ?? token === null ? this : this.client.getAuth();
  }

  /**
   * Set a task to be run before a request is sent. The task is passed the
   * request options, and is expected to return `undefined` _or_ modified
   * options.
   * @param cb Task to run before a request is sent.
   * @returns The REST client instance.
   */
  before(cb: REST['beforeRequest']) {
    this.beforeRequest = cb;
    return this;
  }

  /**
   * Set a task to be run after a request is sent. The task is passed the
   * request options, the response data and parsed JSON from the response, and
   * is not expected to return anything.
   * @param cb Task to run after a request is sent.
   * @returns The REST client instance.
   */
  after(cb: REST['afterRequest']) {
    this.afterRequest = cb;
    return this;
  }

  //#region Methods

  /**
   * Send a request to the Discord API
   * @param options Request data to send alongside boilerplate headers
   * @returns JSON response from the API
   */
  async request<T>(options: APIRequest & { buf?: boolean }): Promise<T> {
    const token = this.client.getAuth();
    if (token && !token.startsWith('Bot ') && !token.startsWith('Bearer ')) {
      this.client.setAuth(`Bot ${token}`);
    }

    const task = await this.beforeRequest?.(options);

    if (
      task &&
      typeof task === 'object' &&
      !Array.isArray(task) &&
      task !== null
    ) {
      Object.assign(options, task);
    }

    const res = await this.queue(options);

    if (options.buf)
      return res.body.arrayBuffer().then(Buffer.from) as Promise<T>;

    const text = await res.body.text();

    let json = null as any;

    try {
      json = JSON.parse(text);
    } catch (e) {
      // do nothing
    }

    await this.afterRequest?.(options, res, text, json);

    return json;
  }

  /**
   * Send a HTTP GET request to the Discord API
   * @param route Route to send the request to
   * @param options Additional request options. `body` and `files` are ignored.
   * @returns JSON response from the API
   */
  get<T>(route: RouteLike, options?: RequestOptions) {
    if (options?.body) {
      delete options.body;
    }
    if (options?.files) {
      delete options.files;
    }

    return this.request<T>({
      method: 'GET',
      route,
      ...options,
    });
  }

  /**
   * Send a HTTP POST request to the Discord API
   * @param route Route to send the request to
   * @param options Additional request options. `body` and `files` are merged if
   *     both
   * are supplied, using different strategies for `body` depending on
   * {@link APIRequest.payloadJson}.
   * @returns JSON response from the API
   */
  post<T>(route: RouteLike, options: RequestOptions) {
    return this.request<T>({
      method: 'POST',
      route,
      ...options,
    });
  }

  /**
   * Send a HTTP PUT request to the Discord API
   * @param route Route to send the request to
   * @param options Additional request options. `body` and `files` are treated
   *     like
   * in {@link REST.post}.
   * @returns JSON response from the API
   */
  put<T>(route: RouteLike, options: RequestOptions) {
    return this.request<T>({
      method: 'PUT',
      route,
      ...options,
    });
  }

  /**
   * Send a HTTP PATCH request to the Discord API
   * @param route Route to send the request to
   * @param options Additional request options. `body` and `files` are treated
   *     like
   * in {@link REST.post}.
   * @returns JSON response from the API
   */
  patch<T>(route: RouteLike, options: RequestOptions) {
    return this.request<T>({
      method: 'PATCH',
      route,
      ...options,
    });
  }

  /**
   * Send a HTTP DELETE request to the Discord API
   * @param route Route to send the request to
   * @param options Additional request options. `body` and `files` are ignored.
   * @returns JSON/empty response from the API, usually 204 No Content therefore
   *     empty
   */
  delete<T>(route: RouteLike, options?: RequestOptions) {
    return this.request<T>({
      method: 'DELETE',
      route,
      ...options,
    });
  }

  /**
   * Send a HTTP OPTIONS request to the Discord API
   * @param route Route to send the request to
   * @param options Additional request options.
   */
  options<T>(route: RouteLike, options?: RequestOptions) {
    return this.request<T>({
      method: 'OPTIONS',
      route,
      ...options,
    });
  }

  /**
   * Send a HTTP HEAD request to the Discord API
   * @param route Route to send the request to
   * @param options Additional request options.
   * @returns Empty response from the API, headers are consumed internally.
   */
  head<T>(route: RouteLike, options?: RequestOptions) {
    return this.request<T>({
      method: 'HEAD',
      route,
      ...options,
    });
  }

  //#endregion

  //#region Audit Log

  /**
   * Requires the `VIEW_AUDIT_LOG` permission
   */
  getGuildAuditLog(guildID: string, options: RESTGetAPIAuditLogQuery) {
    return this.get<RESTGetAPIAuditLogResult>(`/guilds/${guildID}/audit-logs`, {
      query: options,
    });
  }

  //#endregion

  //#region Channel

  getChannel(id: string) {
    return this.get<RESTGetAPIChannelResult>(`/channels/${id}`);
  }

  editChannel(id: string, data: RESTPatchAPIChannelJSONBody, reason?: string) {
    return this.patch<RESTPatchAPIChannelResult>(`/channels/${id}`, {
      body: data,
      reason,
    });
  }

  deleteChannel(id: string, reason?: string) {
    return this.delete<RESTDeleteAPIChannelResult>(`/channels/${id}`, {
      reason,
    });
  }

  closeDM(channelID: string) {
    return this.deleteChannel(channelID);
  }

  getChannelMessages(
    channelID: string,
    options: RESTGetAPIChannelMessagesQuery,
  ) {
    return this.get<RESTGetAPIChannelMessagesResult>(
      `/channels/${channelID}/messages`,
      {
        query: options,
      },
    );
  }

  getChannelMessage(channelID: string, messageID: string) {
    return this.get<RESTGetAPIChannelMessageResult>(
      `/channels/${channelID}/messages/${messageID}`,
    );
  }

  createMessage(
    channelID: string,
    data: RESTPostAPIChannelMessageJSONBody,
    files?: File[],
  ) {
    return this.post<RESTPostAPIChannelMessageResult>(
      `/channels/${channelID}/messages`,
      {
        body: data,
        files,
      },
    );
  }

  crosspostMessage(channelID: string, messageID: string) {
    return this.post<RESTPostAPIChannelMessageCrosspostResult>(
      `/channels/${channelID}/messages/${messageID}/crosspost`,
      {
        body: '',
      },
    );
  }

  createReaction(channelID: string, messageID: string, emoji: string) {
    return this.put<RESTPutAPIChannelMessageReactionResult>(
      `/channels/${channelID}/messages/${messageID}/reactions/${encodeURIComponent(
        emoji,
      )}/@me`,
      {},
    );
  }

  deleteOwnReaction(channelID: string, messageID: string, emoji: string) {
    return this.deleteUserReaction(channelID, messageID, emoji, '@me');
  }

  deleteUserReaction(
    channelID: string,
    messageID: string,
    emoji: string,
    userID: string,
  ) {
    return this.delete(
      `/channels/${channelID}/messages/${messageID}/reactions/${encodeURIComponent(
        emoji,
      )}/${userID}`,
    );
  }

  getReactions(
    channelID: string,
    messageID: string,
    emoji: string,
    options?: RESTGetAPIChannelMessageReactionUsersQuery,
  ) {
    return this.get<RESTGetAPIChannelMessageReactionUsersResult>(
      `/channels/${channelID}/messages/${messageID}/reactions/${encodeURIComponent(
        emoji,
      )}`,
      {
        query: options,
      },
    );
  }

  deleteAllReactions(channelID: string, messageID: string) {
    return this.delete(
      `/channels/${channelID}/messages/${messageID}/reactions`,
    );
  }

  deleteAllReactionsForEmoji(
    channelID: string,
    messageID: string,
    emoji: string,
  ) {
    return this.delete(
      `/channels/${channelID}/messages/${messageID}/reactions/${encodeURIComponent(
        emoji,
      )}`,
    );
  }

  editMessage(
    channelID: string,
    messageID: string,
    data: RESTPatchAPIChannelMessageJSONBody,
    files?: File[],
  ) {
    return this.patch<RESTPatchAPIChannelMessageResult>(
      `/channels/${channelID}/messages/${messageID}`,
      {
        body: data,
        files,
      },
    );
  }

  deleteMessage(channelID: string, messageID: string, reason?: string) {
    return this.delete<RESTDeleteAPIChannelMessageResult>(
      `/channels/${channelID}/messages/${messageID}`,
      {
        reason,
      },
    );
  }

  async bulkDeleteMessages(
    channelID: string,
    messages: string[] | number,
    reason?: string,
  ) {
    if (typeof messages === 'number') {
      messages = await this.getChannelMessages(channelID, {
        limit: messages,
      }).then(res => res.map(m => m.id));
    }

    messages = messages as string[];

    return this.post<RESTPostAPIChannelMessagesBulkDeleteResult>(
      `/channels/${channelID}/messages/bulk-delete`,
      {
        body: {
          messages,
        },
        reason,
      },
    );
  }

  editChannelPermissions(
    channelID: string,
    overwriteID: string,
    data: RESTPutAPIChannelPermissionJSONBody,
    reason?: string,
  ) {
    return this.put<RESTPutAPIChannelPermissionResult>(
      `/channels/${channelID}/permissions/${overwriteID}`,
      {
        body: data,
        reason,
      },
    );
  }

  getChannelInvites(channelID: string) {
    return this.get<RESTGetAPIChannelInvitesResult>(
      `/channels/${channelID}/invites`,
    );
  }

  createChannelInvite(
    channelID: string,
    data: RESTPostAPIChannelInviteJSONBody,
    reason?: string,
  ) {
    return this.post<RESTPostAPIChannelInviteResult>(
      `/channels/${channelID}/invites`,
      {
        body: data,
        reason,
      },
    );
  }

  deleteChannelPermission(
    channelID: string,
    overwriteID: string,
    reason?: string,
  ) {
    return this.delete<RESTDeleteAPIChannelPermissionResult>(
      `/channels/${channelID}/permissions/${overwriteID}`,
      {
        reason,
      },
    );
  }

  followNewsChannel(channelID: string, webhookChannelID: string) {
    return this.post<RESTPostAPIChannelFollowersResult>(
      `/channels/${channelID}/followers`,
      {
        body: {
          webhook_channel_id: webhookChannelID,
        },
      },
    );
  }

  triggerTypingIndicator(channelID: string) {
    return this.post<RESTPostAPIChannelTypingResult>(
      `/channels/${channelID}/typing`,
      {},
    );
  }

  getPinnedMessages(channelID: string) {
    return this.get<RESTGetAPIChannelPinsResult>(`/channels/${channelID}/pins`);
  }

  pinMessage(channelID: string, messageID: string, reason?: string) {
    return this.put<RESTPutAPIChannelPinResult>(
      `/channels/${channelID}/pins/${messageID}`,
      {
        reason,
      },
    );
  }

  unpinMessage(channelID: string, messageID: string, reason?: string) {
    return this.delete<RESTDeleteAPIChannelPinResult>(
      `/channels/${channelID}/pins/${messageID}`,
      {
        reason,
      },
    );
  }

  addGroupDMRecipient(
    channelID: string,
    userID: string,
    accessToken: string,
    nickname?: string,
  ) {
    return this.put<RESTPutAPIChannelRecipientResult>(
      `/channels/${channelID}/recipients/${userID}`,
      {
        body: {
          access_token: accessToken,
          nick: nickname,
        },
      },
    );
  }

  removeGroupDMRecipient(channelID: string, userID: string) {
    return this.delete<RESTDeleteAPIChannelRecipientResult>(
      `/channels/${channelID}/recipients/${userID}`,
    );
  }

  startThreadFromMessage(
    channelID: string,
    messageID: string,
    data: RESTPostAPIChannelMessagesThreadsJSONBody,
    reason?: string,
  ) {
    return this.post<RESTPostAPIChannelMessagesThreadsResult>(
      `/channels/${channelID}/messages/${messageID}/threads`,
      {
        body: data,
        reason,
      },
    );
  }

  startThread(
    channelID: string,
    data: RESTPostAPIChannelThreadsJSONBody,
    reason?: string,
  ) {
    return this.post<RESTPostAPIChannelThreadsResult>(
      `/channels/${channelID}/threads`,
      {
        body: data,
        reason,
      },
    );
  }

  startThreadInForumChannel(
    channelID: string,
    data: RESTPostAPIGuildForumThreadsJSONBody,
    { reason, files }: { reason?: string; files?: File[] } = {},
  ) {
    return this.post<RESTPostAPIGuildForumThreadsJSONBody>(
      `/channels/${channelID}/threads`,
      {
        body: data,
        files,
        reason,
      },
    );
  }

  joinThread(channelID: string) {
    return this.addThreadMember(channelID, '@me');
  }

  addThreadMember(channelID: string, userID: string) {
    return this.put<RESTPutAPIChannelThreadMembersResult>(
      `/channels/${channelID}/thread-members/${userID}`,
      {},
    );
  }

  leaveThread(channelID: string) {
    return this.removeThreadMember(channelID, '@me');
  }

  removeThreadMember(channelID: string, userID: string) {
    return this.delete<RESTDeleteAPIChannelThreadMembersResult>(
      `/channels/${channelID}/thread-members/${userID}`,
    );
  }

  getThreadMember(channelID: string, userID: string) {
    return this.get<RESTGetAPIChannelThreadMembersResult>(
      `/channels/${channelID}/thread-members/${userID}`,
    );
  }

  listThreadMembers(channelID: string) {
    return this.get<RESTGetAPIChannelThreadMembersResult>(
      `/channels/${channelID}/thread-members`,
    );
  }

  /**
   * @deprecated This endpoint is deprecated and will be removed in API v10.
   */
  listActiveThreads(channelID: string) {
    return this.get<APIThreadList>(`/channels/${channelID}/threads/active`);
  }

  listPublicArchivedThreads(
    channelID: string,
    options?: RESTGetAPIChannelThreadsArchivedQuery,
  ) {
    return this.get<APIThreadList>(
      `/channels/${channelID}/threads/archived/public`,
      {
        query: options,
      },
    );
  }

  listPrivateArchivedThreads(
    channelID: string,
    options?: RESTGetAPIChannelThreadsArchivedQuery,
  ) {
    return this.get<APIThreadList>(
      `/channels/${channelID}/threads/archived/private`,
      {
        query: options,
      },
    );
  }

  listJoinedPrivateArchivedThreads(
    channelID: string,
    options?: RESTGetAPIChannelThreadsArchivedQuery,
  ) {
    return this.get<APIThreadList>(
      `/channels/${channelID}/users/@me/threads/archived/private`,
      {
        query: options,
      },
    );
  }

  //#endregion

  //#region Emoji
  listGuildEmojis(guildID: string) {
    return this.get<RESTGetAPIGuildEmojisResult>(`/guilds/${guildID}/emojis`);
  }

  getGuildEmoji(guildID: string, emojiID: string) {
    return this.get<RESTGetAPIGuildEmojiResult>(
      `/guilds/${guildID}/emojis/${emojiID}`,
    );
  }

  createGuildEmoji(
    guildID: string,
    name: string,
    data: File,
    roles?: string[],
    reason?: string,
  ) {
    return this.post<RESTPostAPIGuildEmojiResult>(`/guilds/${guildID}/emojis`, {
      body: {
        name,
        image: createDataURI(data),
        roles,
      },
      reason,
    });
  }

  editGuildEmoji(
    guildID: string,
    emojiID: string,
    data: RESTPatchAPIGuildEmojiJSONBody,
    reason?: string,
  ) {
    return this.patch<RESTPatchAPIGuildEmojiResult>(
      `/guilds/${guildID}/emojis/${emojiID}`,
      {
        body: data,
        reason,
      },
    );
  }

  deleteGuildEmoji(guildID: string, emojiID: string, reason?: string) {
    return this.delete<RESTDeleteAPIGuildEmojiResult>(
      `/guilds/${guildID}/emojis/${emojiID}`,
      {
        reason,
      },
    );
  }

  //#endregion

  //#region Guild
  getGuild(guildID: string, withCounts = false) {
    return this.get<RESTGetAPIGuildResult>(`/guilds/${guildID}`, {
      query: {
        with_counts: withCounts,
      },
    });
  }

  getGuildPreview(guildID: string) {
    return this.get<RESTGetAPIGuildPreviewResult>(`/guilds/${guildID}/preview`);
  }

  editGuild(guildID: string, data: RESTPatchAPIGuildJSONBody, reason?: string) {
    return this.patch<RESTPatchAPIGuildResult>(`/guilds/${guildID}`, {
      body: data,
      reason,
    });
  }

  deleteGuild(guildID: string) {
    return this.delete<RESTDeleteAPIGuildResult>(`/guilds/${guildID}`);
  }

  getGuildChannels(guildID: string) {
    return this.get<RESTGetAPIGuildChannelsResult>(
      `/guilds/${guildID}/channels`,
    );
  }

  createGuildChannel(
    guildID: string,
    data: RESTPostAPIGuildChannelJSONBody,
    reason?: string,
  ) {
    return this.post<RESTPostAPIGuildChannelResult>(
      `/guilds/${guildID}/channels`,
      {
        body: data,
        reason,
      },
    );
  }

  editGuildChannelPositions(
    guildID: string,
    data: RESTPatchAPIGuildChannelPositionsJSONBody,
    reason?: string,
  ) {
    return this.patch<RESTPatchAPIGuildChannelPositionsResult>(
      `/guilds/${guildID}/channels`,
      {
        body: data,
        reason,
      },
    );
  }

  getGuildMember(guildID: string, userID: string) {
    return this.get<RESTGetAPIGuildMemberResult>(
      `/guilds/${guildID}/members/${userID}`,
    );
  }

  listGuildMembers(guildID: string, options?: RESTGetAPIGuildMembersQuery) {
    return this.get<RESTGetAPIGuildMembersResult>(
      `/guilds/${guildID}/members`,
      {
        query: options,
      },
    );
  }

  searchGuildMembers(guildID: string, query: string, limit?: number) {
    return this.get<RESTGetAPIGuildMembersResult>(
      `/guilds/${guildID}/members/search`,
      {
        query: {
          query,
          limit,
        },
      },
    );
  }

  addGuildMember(
    guildID: string,
    userID: string,
    accessToken: string,
    data?: Omit<RESTPutAPIGuildMemberJSONBody, 'access_token'>,
  ) {
    return this.put<RESTPutAPIGuildMemberResult>(
      `/guilds/${guildID}/members/${userID}`,
      {
        body: {
          access_token: accessToken,
          ...data,
        },
      },
    );
  }

  editGuildMember(
    guildID: string,
    userID: string,
    data: RESTPatchAPIGuildMemberJSONBody,
    reason?: string,
  ) {
    return this.patch<RESTPatchAPIGuildMemberResult>(
      `/guilds/${guildID}/members/${userID}`,
      {
        body: data,
        reason,
      },
    );
  }

  editCurrentMember(guildID: string, nickname?: string, reason?: string) {
    return this.editGuildMember(
      guildID,
      '@me',
      {
        nick: nickname,
      },
      reason,
    );
  }

  /**
   * @deprecated Deprecated in favour of {@link REST.editCurrentMember}
   */
  editCurrentUserNick(guildID: string, nickname?: string, reason?: string) {
    return this.patch<APIGuildMember>(`/guilds/${guildID}/members/@me/nick`, {
      body: {
        nick: nickname,
      },
      reason,
    });
  }

  addGuildMemberRole(
    guildID: string,
    userID: string,
    roleID: string,
    reason?: string,
  ) {
    return this.put<RESTPutAPIGuildMemberRoleResult>(
      `/guilds/${guildID}/members/${userID}/roles/${roleID}`,
      {
        reason,
      },
    );
  }

  removeGuildMemberRole(
    guildID: string,
    userID: string,
    roleID: string,
    reason?: string,
  ) {
    return this.delete<RESTDeleteAPIGuildMemberRoleResult>(
      `/guilds/${guildID}/members/${userID}/roles/${roleID}`,
      {
        reason,
      },
    );
  }

  removeGuildMember(guildID: string, userID: string, reason?: string) {
    return this.delete<RESTDeleteAPIGuildMemberResult>(
      `/guilds/${guildID}/members/${userID}`,
      {
        reason,
      },
    );
  }

  getGuildBans(guildID: string, options?: RESTGetAPIGuildBansQuery) {
    return this.get<RESTGetAPIGuildBansResult>(`/guilds/${guildID}/bans`, {
      query: options,
    });
  }

  getGuildBan(guildID: string, userID: string) {
    return this.get<RESTGetAPIGuildBanResult>(
      `/guilds/${guildID}/bans/${userID}`,
    );
  }

  createGuildBan(
    guildID: string,
    userID: string,
    data: RESTPutAPIGuildBanJSONBody,
    reason?: string,
  ) {
    return this.put<RESTPutAPIGuildBanResult>(
      `/guilds/${guildID}/bans/${userID}`,
      {
        body: data,
        reason,
      },
    );
  }

  removeGuildBan(guildID: string, userID: string, reason?: string) {
    return this.delete<RESTDeleteAPIGuildBanResult>(
      `/guilds/${guildID}/bans/${userID}`,
      {
        reason,
      },
    );
  }

  getGuildRoles(guildID: string) {
    return this.get<RESTGetAPIGuildRolesResult>(`/guilds/${guildID}/roles`);
  }

  createGuildRole(
    guildID: string,
    data: RESTPostAPIGuildRoleJSONBody & {
      icon: Omit<File, 'filename' | 'key'> | string;
    },
    reason?: string,
  ) {
    if (data.icon && typeof data.icon !== 'string')
      data.icon = createDataURI(data.icon);

    return this.post<RESTPostAPIGuildRoleResult>(`/guilds/${guildID}/roles`, {
      body: data,
      reason,
    });
  }

  editGuildRolePositions(
    guildID: string,
    data: RESTPatchAPIGuildRolePositionsJSONBody,
    reason?: string,
  ) {
    return this.patch<RESTPatchAPIGuildRolePositionsResult>(
      `/guilds/${guildID}/roles`,
      {
        body: data,
        reason,
      },
    );
  }

  editGuildRole(
    guildID: string,
    roleID: string,
    data: RESTPatchAPIGuildRoleJSONBody,
    reason?: string,
  ) {
    return this.patch<RESTPatchAPIGuildRoleResult>(
      `/guilds/${guildID}/roles/${roleID}`,
      {
        body: data,
        reason,
      },
    );
  }

  deleteGuildRole(guildID: string, roleID: string, reason?: string) {
    return this.delete<RESTDeleteAPIGuildRoleResult>(
      `/guilds/${guildID}/roles/${roleID}`,
      {
        reason,
      },
    );
  }

  getGuildPruneCount(
    guildID: string,
    options?: RESTGetAPIGuildPruneCountQuery,
  ) {
    return this.get<RESTGetAPIGuildPruneCountResult>(
      `/guilds/${guildID}/prune`,
      {
        query: options,
      },
    );
  }

  startGuildPrune(
    guildID: string,
    options?: RESTPostAPIGuildPruneJSONBody,
    reason?: string,
  ) {
    return this.post<RESTPostAPIGuildPruneResult>(`/guilds/${guildID}/prune`, {
      body: options,
      reason,
    });
  }

  getGuildVoiceRegions(guildID: string) {
    return this.get<RESTGetAPIGuildVoiceRegionsResult>(
      `/guilds/${guildID}/regions`,
    );
  }

  getGuildInvites(guildID: string) {
    return this.get<RESTGetAPIGuildInvitesResult>(`/guilds/${guildID}/invites`);
  }

  getGuildIntegrations(guildID: string) {
    return this.get<RESTGetAPIGuildIntegrationsResult>(
      `/guilds/${guildID}/integrations`,
    );
  }

  deleteGuildIntegration(
    guildID: string,
    integrationID: string,
    reason?: string,
  ) {
    return this.delete<RESTDeleteAPIGuildIntegrationResult>(
      `/guilds/${guildID}/integrations/${integrationID}`,
      {
        reason,
      },
    );
  }

  getGuildWidgetSettings(guildID: string) {
    return this.get<RESTGetAPIGuildWidgetSettingsResult>(
      `/guilds/${guildID}/widget`,
    );
  }

  editGuildWidgetSettings(
    guildID: string,
    data: RESTPatchAPIGuildWidgetSettingsJSONBody,
    reason?: string,
  ) {
    return this.patch<RESTPatchAPIGuildWidgetSettingsResult>(
      `/guilds/${guildID}/widget`,
      {
        body: data,
        reason,
      },
    );
  }

  getGuildWidgetData(guildID: string) {
    return this.get<RESTGetAPIGuildWidgetResult>(
      `/guilds/${guildID}/widget.json`,
    );
  }

  getGuildVanity(guildID: string) {
    return this.get<RESTGetAPIGuildVanityUrlResult>(
      `/guilds/${guildID}/vanity-url`,
    );
  }

  getGuildWidgetImage(guildID: string, style: GuildWidgetStyle) {
    return this.get<Buffer>(`/guilds/${guildID}/widget.png`, {
      query: {
        style,
      },
    });
  }

  getGuildWelcomeScreen(guildID: string) {
    return this.get<RESTGetAPIGuildWelcomeScreenResult>(
      `/guilds/${guildID}/welcome-screen`,
    );
  }

  editGuildWelcomeScreen(
    guildID: string,
    data: RESTPatchAPIGuildWelcomeScreenJSONBody,
    reason?: string,
  ) {
    return this.patch<RESTGetAPIGuildWelcomeScreenResult>(
      `/guilds/${guildID}/welcome-screen`,
      {
        body: data,
        reason,
      },
    );
  }

  editUserVoiceState(
    guildID: string,
    userID: string,
    data: RESTPatchAPIGuildVoiceStateUserJSONBody & {
      request_to_speak_timestamp?: string;
    },
    reason?: string,
  ) {
    return this.patch<never>(`/guilds/${guildID}/voice-states/${userID}`, {
      body: data,
      reason,
    });
  }

  editCurrentUserVoiceState(
    guildID: string,
    data: RESTPatchAPIGuildVoiceStateCurrentMemberJSONBody,
    reason?: string,
  ) {
    return this.editUserVoiceState(
      guildID,
      '@me',
      data as RESTPatchAPIGuildVoiceStateUserJSONBody,
      reason,
    );
  }

  //#endregion

  //#region Scheduled Events

  listGuildScheduledEvents(guildID: string, withUserCount = false) {
    return this.get<RESTGetAPIGuildScheduledEventsResult>(
      `/guilds/${guildID}/scheduled-events`,
      {
        query: {
          with_user_count: withUserCount,
        },
      },
    );
  }

  createGuildScheduledEvent(
    guildID: string,
    data: Omit<RESTPostAPIGuildScheduledEventJSONBody, 'image'>,
    { image, reason }: { image?: File; reason?: string } = {},
  ) {
    return this.post<RESTPostAPIGuildScheduledEventResult>(
      `/guilds/${guildID}/scheduled-events`,
      {
        body: {
          image: image ? createDataURI(image) : undefined,
          ...data,
        },
        reason,
      },
    );
  }

  getGuildScheduledEvent(
    guildID: string,
    scheduledEventID: string,
    withUserCount = false,
  ) {
    return this.get<RESTGetAPIGuildScheduledEventResult>(
      `/guilds/${guildID}/scheduled-events/${scheduledEventID}`,
      {
        query: {
          with_user_count: withUserCount,
        },
      },
    );
  }

  editGuildScheduledEvent(
    guildID: string,
    scheduledEventID: string,
    data: Omit<RESTPatchAPIGuildScheduledEventJSONBody, 'image'>,
    { image, reason }: { image?: File; reason?: string } = {},
  ) {
    return this.patch<RESTPatchAPIGuildScheduledEventResult>(
      `/guilds/${guildID}/scheduled-events/${scheduledEventID}`,
      {
        body: {
          image: image ? createDataURI(image) : undefined,
          ...data,
        },
        reason,
      },
    );
  }

  deleteGuildScheduledEvent(guildID: string, scheduledEventID: string) {
    return this.delete<RESTDeleteAPIGuildScheduledEventResult>(
      `/guilds/${guildID}/scheduled-events/${scheduledEventID}`,
    );
  }

  getGuildScheduledEventUsers(
    guildID: string,
    scheduledEventID: string,
    options: RESTGetAPIGuildScheduledEventUsersQuery,
  ) {
    return this.get<RESTGetAPIGuildScheduledEventUsersResult>(
      `/guilds/${guildID}/scheduled-events/${scheduledEventID}/users`,
      {
        query: options,
      },
    );
  }

  //#endregion

  //#region Templates

  getGuildTemplate(code: string) {
    return this.get<APITemplate>(`/guilds/templates/${code}`);
  }

  createGuildFromTemplate(code: string, data: { name: string; icon: File }) {
    return this.post<APIGuild>(`/guilds/templates/${code}`, {
      body: {
        ...data,
        icon: createDataURI(data.icon),
      },
    });
  }

  getGuildTemplates(guildID: string) {
    return this.get<RESTGetAPIGuildTemplatesResult>(
      `/guilds/${guildID}/templates`,
    );
  }

  createGuildTemplate(
    guildID: string,
    data: { name: string; description: string },
  ) {
    return this.post<APITemplate>(`/guilds/${guildID}/templates`, {
      body: data,
    });
  }

  syncGuildTemplate(guildID: string, code: string) {
    return this.put<APITemplate>(`/guilds/${guildID}/templates/${code}`, {});
  }

  editGuildTemplate(
    guildID: string,
    code: string,
    data: { name: string; description: string },
  ) {
    return this.patch<APITemplate>(`/guilds/${guildID}/templates/${code}`, {
      body: data,
    });
  }

  deleteGuildTemplate(guildID: string, code: string) {
    return this.delete<APITemplate>(`/guilds/${guildID}/templates/${code}`);
  }

  //#endregion

  //#region Invites

  getInvite(code: string, options: RESTGetAPIInviteQuery = {}) {
    return this.get<RESTGetAPIInviteResult>(`/invites/${code}`, {
      query: options,
      auth: false,
    });
  }

  deleteInvite(code: string) {
    return this.delete<RESTDeleteAPIInviteResult>(`/invites/${code}`);
  }

  //#endregion

  //#region Stage Instances

  createStageInstance(
    channelID: string,
    data: Omit<RESTPostAPIStageInstanceJSONBody, 'channel_id'>,
    reason?: string,
  ) {
    return this.post<RESTPostAPIStageInstanceResult>(`/stage-instances`, {
      body: {
        channel_id: channelID,
        ...data,
      },
      reason,
    });
  }

  getStageInstance(channelID: string) {
    return this.get<RESTGetAPIStageInstanceResult>(
      `/stage-instances/${channelID}`,
    );
  }

  editStageInstance(
    channelID: string,
    data: RESTPatchAPIStageInstanceJSONBody,
    reason?: string,
  ) {
    return this.patch<RESTPatchAPIStageInstanceResult>(
      `/stage-instances/${channelID}`,
      {
        body: data,
        reason,
      },
    );
  }

  deleteStageInstance(channelID: string) {
    return this.delete<RESTDeleteAPIStageInstanceResult>(
      `/stage-instances/${channelID}`,
    );
  }

  //#endregion

  //#region Stickers

  getSticker(stickerID: string) {
    return this.get<RESTGetAPIStickerResult>(`/stickers/${stickerID}`);
  }

  listPremiumStickerPacks() {
    return this.get<RESTGetNitroStickerPacksResult>(`/sticker-packs`);
  }

  listGuildStickers(guildID: string) {
    return this.get<RESTGetAPIGuildStickersResult>(
      `/guilds/${guildID}/stickers`,
    );
  }

  getGuildSticker(guildID: string, stickerID: string) {
    return this.get<RESTGetAPIGuildStickerResult>(
      `/guilds/${guildID}/stickers/${stickerID}`,
    );
  }

  createGuildSticker(
    guildID: string,
    data: Omit<RESTPostAPIGuildStickerFormDataBody, 'file'>,
    image: File,
    reason?: string,
  ) {
    return this.post<RESTPostAPIGuildStickerResult>(
      `/guilds/${guildID}/stickers`,
      {
        body: data,
        files: [
          {
            key: 'file',
            ...image,
          },
        ],
        reason,
      },
    );
  }

  editGuildSticker(
    guildID: string,
    stickerID: string,
    data: RESTPatchAPIGuildStickerJSONBody,
    reason?: string,
  ) {
    return this.patch<RESTPatchAPIGuildStickerResult>(
      `/guilds/${guildID}/stickers/${stickerID}`,
      {
        body: data,
        reason,
      },
    );
  }

  deleteGuildSticker(guildID: string, stickerID: string, reason?: string) {
    return this.delete<RESTDeleteAPIGuildStickerResult>(
      `/guilds/${guildID}/stickers/${stickerID}`,
      {
        reason,
      },
    );
  }

  //#endregion

  //#region Users

  getCurrentUser() {
    return this.getUser('@me') as Promise<RESTGetAPICurrentUserResult>;
  }

  getUser(userID: string) {
    return this.get<RESTGetAPIUserResult>(`/users/${userID}`);
  }

  editCurrentUser(data: RESTPatchAPICurrentUserJSONBody) {
    return this.patch<RESTPatchAPICurrentUserResult>(`/users/@me`, {
      body: data,
    });
  }

  getCurrentUserGuilds(options: RESTGetAPICurrentUserGuildsQuery = {}) {
    return this.get<RESTGetAPICurrentUserGuildsResult>(`/users/@me/guilds`, {
      query: options,
    });
  }

  getCurrentGuildMember(guildID: string) {
    return this.get<APIGuildMember>(`/users/@me/guilds/${guildID}/member`);
  }

  leaveGuild(guildID: string) {
    return this.delete<RESTDeleteAPICurrentUserGuildResult>(
      `/users/@me/guilds/${guildID}`,
    );
  }

  createDM(recipientID: string) {
    return this.post<APIChannel>(`/users/@me/channels`, {
      body: {
        recipient_id: recipientID,
      },
    });
  }

  createGroupDM(accessTokens: string[], nicks?: Record<string, string>) {
    return this.post<APIChannel>(`/users/@me/channels`, {
      body: {
        access_tokens: accessTokens,
        nicks,
      },
    });
  }

  getUserConnections(userID: string) {
    return this.get<APIConnection>(`/users/${userID}/connections`);
  }

  //#endregion

  //#region Voice

  listVoiceRegions() {
    return this.get<APIVoiceRegion[]>(`/voice/regions`);
  }

  //#endregion

  //#region Webhooks

  createWebhook(
    channelID: string,
    data: RESTPostAPIChannelWebhookJSONBody,
    reason?: string,
  ) {
    return this.post<RESTPostAPIChannelWebhookResult>(
      `/channels/${channelID}/webhooks`,
      {
        body: data,
        reason,
      },
    );
  }

  getChannelWebhooks(channelID: string) {
    return this.get<APIWebhook[]>(`/channels/${channelID}/webhooks`);
  }

  getGuildWebhooks(guildID: string) {
    return this.get<APIWebhook[]>(`/guilds/${guildID}/webhooks`);
  }

  getWebhook(webhookID: string) {
    return this.get<APIWebhook>(`/webhooks/${webhookID}`);
  }

  getWebhookWithToken(webhookID: string, token: string) {
    return this.get<APIWebhook>(`/webhooks/${webhookID}/${token}`, {
      auth: false,
    });
  }

  editWebhook(
    webhookID: string,
    data: RESTPatchAPIWebhookJSONBody,
    reason?: string,
  ) {
    return this.patch<RESTPatchAPIWebhookResult>(`/webhooks/${webhookID}`, {
      body: data,
      reason,
    });
  }

  editWebhookWithToken(
    webhookID: string,
    token: string,
    data: Omit<RESTPatchAPIWebhookJSONBody, 'channel_id'>,
  ) {
    return this.patch<Omit<RESTPatchAPIWebhookResult, 'user'>>(
      `/webhooks/${webhookID}/${token}`,
      {
        body: data,
        auth: false,
      },
    );
  }

  deleteWebhook(webhookID: string, reason?: string) {
    return this.delete<RESTDeleteAPIWebhookResult>(`/webhooks/${webhookID}`, {
      reason,
    });
  }

  deleteWebhookWithToken(webhookID: string, token: string) {
    return this.delete<RESTDeleteAPIWebhookResult>(
      `/webhooks/${webhookID}/${token}`,
      {
        auth: false,
      },
    );
  }

  executeWebhook<T = RESTPostAPIWebhookWithTokenJSONBody>(
    webhookID: string,
    token: string,
    data: T,
    {
      files,
      ...options
    }: RESTPostAPIWebhookWithTokenQuery & { files?: FileData[] } = {},
    ext = '',
  ) {
    return this.post<null | RESTPostAPIWebhookWithTokenWaitResult>(
      `/webhooks/${webhookID}/${token}${ext}`,
      {
        body: data,
        files,
        query: {
          ...options,
        },
        auth: false,
      },
    );
  }

  createWebhookMessage(
    webhookID: string,
    token: string,
    data: RESTPostAPIWebhookWithTokenJSONBody,
    options: RESTPostAPIWebhookWithTokenQuery & { files?: FileData[] } = {},
  ) {
    return this.executeWebhook(webhookID, token, data, options);
  }

  executeWebhookSlack(
    webhookID: string,
    token: string,
    data: any,
    options: RESTPostAPIWebhookWithTokenQuery,
  ) {
    return this.executeWebhook(webhookID, token, data, options, '/slack');
  }

  executeWebhookGitHub(
    webhookID: string,
    token: string,
    data: any,
    options: RESTPostAPIWebhookWithTokenQuery,
  ) {
    return this.executeWebhook(webhookID, token, data, options, '/github');
  }

  getWebhookMessage(
    webhookID: string,
    token: string,
    messageID: string,
    threadID?: string,
  ) {
    return this.get<RESTGetAPIWebhookWithTokenMessageResult>(
      `/webhooks/${webhookID}/${token}/messages/${messageID}`,
      {
        query: {
          thread_id: threadID,
        },
        auth: false,
      },
    );
  }

  editWebhookMessage(
    webhookID: string,
    token: string,
    messageID: string,
    data: RESTPatchAPIWebhookWithTokenMessageJSONBody,
    { files, ...options }: { thread_id?: string; files?: FileData[] } = {},
  ) {
    return this.patch<RESTPatchAPIWebhookWithTokenMessageResult>(
      `/webhooks/${webhookID}/${token}/messages/${messageID}`,
      {
        body: data,
        files,
        query: options,
        auth: false,
      },
    );
  }

  deleteWebhookMessage(
    webhookID: string,
    token: string,
    messageID: string,
    threadID?: string,
  ) {
    return this.delete<RESTDeleteAPIWebhookWithTokenMessageResult>(
      `/webhooks/${webhookID}/${token}/messages/${messageID}`,
      {
        query: {
          thread_id: threadID,
        },
        auth: false,
      },
    );
  }

  //#endregion

  //#region Gateway

  getGateway() {
    return this.get<RESTGetAPIGatewayResult>('/gateway', { auth: false });
  }

  getGatewayBot() {
    return this.get<RESTGetAPIGatewayBotResult>('/gateway/bot');
  }

  //#endregion

  //#region OAuth2

  getCurrentOAuth2Authorization() {
    return this.get<RESTGetAPIOAuth2CurrentAuthorizationResult>('/oauth2/@me');
  }

  getCurrentBotApplication() {
    return this.get<RESTGetAPIOAuth2CurrentApplicationResult>(
      '/oauth2/applications/@me',
    );
  }

  //#endregion

  //#region Interactions

  createInteractionResponse(
    interactionID: string,
    token: string,
    data: RESTPostAPIInteractionCallbackJSONBody,
    files?: FileData[],
  ) {
    return this.post<never>(
      `/interactions/${interactionID}/${token}/callback`,
      {
        body: data,
        files,
      },
    );
  }

  getOriginalInteractionResponse(
    applicationID: string,
    interactionToken: string,
  ) {
    return this.getWebhookMessage(applicationID, interactionToken, '@original');
  }

  editOriginalInteractionResponse(
    applicationID: string,
    interactionToken: string,
    data: RESTPatchAPIInteractionOriginalResponseJSONBody,
    files?: FileData[],
  ) {
    return this.editWebhookMessage(
      applicationID,
      interactionToken,
      '@original',
      data,
      { files },
    );
  }

  deleteOriginalInteractionResponse(
    applicationID: string,
    interactionToken: string,
  ) {
    return this.deleteWebhookMessage(
      applicationID,
      interactionToken,
      '@original',
    );
  }

  createFollowupMessage(
    applicationID: string,
    interactionToken: string,
    data: RESTPostAPIInteractionFollowupJSONBody,
    files?: FileData[],
  ) {
    return this.executeWebhook(applicationID, interactionToken, data, {
      files,
    });
  }

  getFollowupMessage(
    applicationID: string,
    interactionToken: string,
    messageID: string,
  ) {
    return this.getWebhookMessage(applicationID, interactionToken, messageID);
  }

  editFollowupMessage(
    applicationID: string,
    interactionToken: string,
    messageID: string,
    data: RESTPatchAPIInteractionFollowupJSONBody,
    files?: FileData[],
  ) {
    return this.editWebhookMessage(
      applicationID,
      interactionToken,
      messageID,
      data,
      { files },
    );
  }

  deleteFollowupMessage(
    applicationID: string,
    interactionToken: string,
    messageID: string,
  ) {
    return this.deleteWebhookMessage(
      applicationID,
      interactionToken,
      messageID,
    );
  }

  //#region Application Commands

  getGlobalApplicationCommands(
    applicationID: string,
    {
      locale,
      localizations,
    }: {
      locale?: Locale;
      localizations?: boolean;
    } = {},
  ) {
    return this.get<RESTGetAPIApplicationCommandsResult>(
      `/applications/${applicationID}/commands`,
      {
        locale,
        query: {
          with_localizations: localizations ?? !locale,
        },
      },
    );
  }

  createGlobalApplicationCommand(
    applicationID: string,
    data: RESTPostAPIApplicationCommandsJSONBody,
  ) {
    return this.post<RESTPostAPIApplicationCommandsResult>(
      `/applications/${applicationID}/commands`,
      {
        body: data,
      },
    );
  }

  getGlobalApplicationCommand(
    applicationID: string,
    commandID: string,
    locale?: Locale,
  ) {
    return this.get<RESTGetAPIApplicationCommandResult>(
      `/applications/${applicationID}/commands/${commandID}`,
      {
        locale,
      },
    );
  }

  editGlobalApplicationCommand(
    applicationID: string,
    commandID: string,
    data: RESTPatchAPIApplicationCommandJSONBody,
  ) {
    return this.patch<RESTPatchAPIApplicationCommandResult>(
      `/applications/${applicationID}/commands/${commandID}`,
      {
        body: data,
      },
    );
  }

  deleteGlobalApplicationCommand(applicationID: string, commandID: string) {
    return this.delete<never>(
      `/applications/${applicationID}/commands/${commandID}`,
    );
  }

  bulkEditGlobalApplicationCommands(
    applicationID: string,
    data: RESTPutAPIApplicationCommandsJSONBody,
  ) {
    return this.put<RESTPutAPIApplicationCommandsResult>(
      `/applications/${applicationID}/commands`,
      {
        body: data,
      },
    );
  }

  getGuildApplicationCommands(
    applicationID: string,
    guildID: string,
    {
      locale,
      localizations,
    }: { locale?: Locale; localizations?: boolean } = {},
  ) {
    return this.get<RESTGetAPIApplicationCommandsResult>(
      `/applications/${applicationID}/guilds/${guildID}/commands`,
      {
        locale,
        query: {
          with_localizations: localizations ?? !locale,
        },
      },
    );
  }

  createGuildApplicationCommand(
    applicationID: string,
    guildID: string,
    data: RESTPostAPIApplicationCommandsJSONBody,
  ) {
    return this.post<RESTPostAPIApplicationCommandsResult>(
      `/applications/${applicationID}/guilds/${guildID}/commands`,
      {
        body: data,
      },
    );
  }

  getGuildApplicationCommand(
    applicationID: string,
    guildID: string,
    commandID: string,
    locale?: Locale,
  ) {
    return this.get<RESTGetAPIApplicationCommandResult>(
      `/applications/${applicationID}/guilds/${guildID}/commands/${commandID}`,
      {
        locale,
      },
    );
  }

  editGuildApplicationCommand(
    applicationID: string,
    guildID: string,
    commandID: string,
    data: RESTPatchAPIApplicationCommandJSONBody,
  ) {
    return this.patch<RESTPatchAPIApplicationCommandResult>(
      `/applications/${applicationID}/guilds/${guildID}/commands/${commandID}`,
      {
        body: data,
      },
    );
  }

  deleteGuildApplicationCommand(
    applicationID: string,
    guildID: string,
    commandID: string,
  ) {
    return this.delete<never>(
      `/applications/${applicationID}/guilds/${guildID}/commands/${commandID}`,
    );
  }

  bulkEditGuildApplicationCommands(
    applicationID: string,
    guildID: string,
    data: RESTPutAPIApplicationCommandsJSONBody,
  ) {
    return this.put<RESTPutAPIApplicationCommandsResult>(
      `/applications/${applicationID}/guilds/${guildID}/commands`,
      {
        body: data,
      },
    );
  }

  getGuildApplicationCommandPermissions(
    applicationID: string,
    guildID: string,
  ) {
    return this.get<RESTGetAPIApplicationCommandPermissionsResult[]>(
      `/applications/${applicationID}/guilds/${guildID}/commands/permissions`,
    );
  }

  getApplicationCommandPermissions(
    applicationID: string,
    guildID: string,
    commandID: string,
  ) {
    return this.get<RESTGetAPIApplicationCommandPermissionsResult>(
      `/applications/${applicationID}/guilds/${guildID}/commands/${commandID}/permissions`,
    );
  }

  //#endregion
}
