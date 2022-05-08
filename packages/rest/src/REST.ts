import {
  RESTDeleteAPIChannelMessageResult,
  RESTDeleteAPIChannelResult,
  RESTGetAPIAuditLogQuery,
  RESTGetAPIAuditLogResult,
  RESTGetAPIChannelInvitesResult,
  RESTGetAPIChannelMessageReactionUsersQuery,
  RESTGetAPIChannelMessageReactionUsersResult,
  RESTGetAPIChannelMessageResult,
  RESTGetAPIChannelMessagesQuery,
  RESTGetAPIChannelMessagesResult,
  RESTGetAPIChannelResult,
  RESTPatchAPIChannelJSONBody,
  RESTPatchAPIChannelMessageJSONBody,
  RESTPatchAPIChannelMessageResult,
  RESTPatchAPIChannelResult,
  RESTPostAPIChannelMessageCrosspostResult,
  RESTPostAPIChannelMessageJSONBody,
  RESTPostAPIChannelMessageResult,
  RESTPostAPIChannelMessagesBulkDeleteResult,
  RESTPutAPIChannelMessageReactionResult,
  RESTPutAPIChannelPermissionJSONBody,
  RESTPutAPIChannelPermissionResult,
} from 'discord-api-types/v10';
import { ResponseData } from 'undici/types/dispatcher';
import { APIRequest, File } from './APIRequest.js';
import { DefaultDiscordOptions } from './index.js';
import {
  RequestManager,
  RequestManagerOptions,
  RouteLike,
} from './RequestManager.js';
import { RESTClient, RESTClientOptions } from './RESTClient.js';

type RequestOptions = Partial<APIRequest>;
type Awaitable<T> = Promise<T> | T;

export class REST extends RequestManager {
  beforeRequest:
    | ((options: RequestOptions) => Awaitable<void | RequestOptions>)
    | undefined = undefined;
  afterRequest:
    | ((
        options: RequestOptions,
        response: ResponseData,
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
   * Set or gets the authentication token for requests to use. Tokens require a token type, must be `Bot` or `Bearer`.
   * @returns The REST client instance if the token was set, otherwise the current token.
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
   * Set a task to be run before a request is sent. The task is passed the request options, and is expected to return `undefined` _or_ modified options.
   * @param cb Task to run before a request is sent.
   * @returns The REST client instance.
   */
  before(cb: REST['beforeRequest']) {
    this.beforeRequest = cb;
    return this;
  }

  /**
   * Set a task to be run after a request is sent. The task is passed the request options, the response data and parsed JSON from the response, and is not expected to return anything.
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
  async request<T>(options: APIRequest): Promise<T> {
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

    const res = await this.queue(options),
      text = await res.body.text();

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
   * @param options Additional request options. `body` and `files` are merged if both
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
   * @param options Additional request options. `body` and `files` are treated like
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
   * @param options Additional request options. `body` and `files` are treated like
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
   * @returns JSON/empty response from the API, usually 204 No Content therefore empty
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
    return this.delete(
      `/channels/${channelID}/messages/${messageID}/reactions/${encodeURIComponent(
        emoji,
      )}/@me`,
    );
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

  //#endregion
}
