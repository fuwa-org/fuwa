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
import { APIRequest, File } from './APIRequest.js';
import {
  RequestManager,
  RequestManagerOptions,
  RouteLike,
} from './RequestManager.js';
import { RESTClient, RESTClientOptions } from './RESTClient.js';

type RequestOptions = Partial<APIRequest>;

export class REST extends RequestManager {
  constructor(
    options: RESTClientOptions,
    managerOptions: RequestManagerOptions = {},
  ) {
    super(new RESTClient(options), managerOptions);
  }

  //#region Methods

  /**
   * Send a request to the Discord API
   * @param options Request data to send alongside boilerplate headers
   * @returns JSON response from the API
   */
  async request<T>(options: APIRequest): Promise<T> {
    const res = await this.queue(options);

    return (await res.body.json()) as T;
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