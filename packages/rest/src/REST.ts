import { APIRequest } from './APIRequest.js';
import {
  RequestManager,
  RequestManagerOptions,
  RouteLike,
} from './RequestManager.js';
import { RESTClient, RESTClientOptions } from './RESTClient.js';
import {
  RESTDeleteAPIChannelResult,
  RESTGetAPIAuditLogQuery,
  RESTGetAPIAuditLogResult,
  RESTGetAPIChannelMessageResult,
  RESTGetAPIChannelMessagesQuery,
  RESTGetAPIChannelMessagesResult,
  RESTGetAPIChannelResult,
  RESTPatchAPIChannelJSONBody,
  RESTPatchAPIChannelResult,
  RESTPostAPIChannelMessageFormDataBody,
  RESTPostAPIChannelMessageJSONBody,
} from 'discord-api-types/v10';

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

  //#endregion
}
