import { RequestManager } from './managers/RequestManager';
import { RESTClient, RESTClientOptions } from './client/RESTClient';
import { REST } from './REST';

export const DefaultDiscordOptions: RESTClientOptions =
  RESTClient.getDefaultOptions();

export * from './client/APIRequest';
export * from './managers/BucketQueueManager';
export * from './managers/RequestManager';
export * from './client/RESTClient';
export * from './error';
export * from './REST';

export { REST as default, RequestManager as Client };
