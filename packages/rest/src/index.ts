import { RequestManager } from './RequestManager.js';
import { RESTClientOptions } from './RESTClient.js';

export * from './APIRequest.js';
export * from './BucketQueueManager.js';
export * from './RequestManager.js';
export * from './RESTClient.js';
export * from './RESTError.js';
export * from './REST.js';

export { RequestManager as default, RequestManager as Client };

export const DefaultDiscordOptions: RESTClientOptions = {
  baseURL: 'https://discord.com/api',
  version: 10,
  userAgent: 'DiscordBot (https://github.com/fuwa-org/fuwa; 0.0.0)',
  headers: {},
  auth: 'Bot <UNSET>',
};
