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

  async request<T>(options: APIRequest): Promise<T> {
    const res = await this.queue(options);

    return (await res.body.json()) as T;
  }

  get<T>(route: RouteLike, options?: RequestOptions) {
    return this.request<T>({
      method: 'GET',
      route,
      ...options,
    });
  }

  post<T>(route: RouteLike, options: RequestOptions) {
    return this.request<T>({
      method: 'POST',
      route,
      ...options,
    });
  }

  put<T>(route: RouteLike, options: RequestOptions) {
    return this.request<T>({
      method: 'PUT',
      route,
      ...options,
    });
  }

  patch<T>(route: RouteLike, options: RequestOptions) {
    return this.request<T>({
      method: 'PATCH',
      route,
      ...options,
    });
  }

  delete<T>(route: RouteLike, options?: RequestOptions) {
    return this.request<T>({
      method: 'DELETE',
      route,
      ...options,
    });
  }

  options<T>(route: RouteLike, options?: RequestOptions) {
    return this.request<T>({
      method: 'OPTIONS',
      route,
      ...options,
    });
  }

  head<T>(route: RouteLike, options?: RequestOptions) {
    return this.request<T>({
      method: 'HEAD',
      route,
      ...options,
    });
  }

  connect<T>(route: RouteLike, options?: RequestOptions) {
    return this.request<T>({
      method: 'CONNECT',
      route,
      ...options,
    });
  }

  //#endregion

  //#region Entrypoints

  getGuildAuditLogs(guildID: string, options: RESTGetAPIAuditLogQuery) {
    return this.get<RESTGetAPIAuditLogResult>(`/guilds/${guildID}/audit-logs`, {
      query: options,
    });
  }

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
