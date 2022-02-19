import { AxiosResponse } from 'axios';
import { Client } from '../client/Client.js';
import { BucketQueueManager } from './BucketQueueManager.js';
import { APIRequest } from './Request';
import { RESTClient } from './RESTClient';
export declare class RequestManager {
    client: RESTClient;
    _client: Client;
    /** The total amount of requests we can make until we're globally rate-limited. */
    limit: number;
    /** The time offset between us and Discord. */
    offset: number;
    /** Queue managers for different buckets */
    private queues;
    /** The remaining requests we can make until we're globally rate-limited. */
    remaining: number;
    /** When the global rate limit will reset. */
    reset: number;
    constructor(client: RESTClient, _client: Client);
    get durUntilReset(): number;
    getBucket(route: RouteLike): string[];
    get globalLimited(): boolean;
    makeRequest(bucket: BucketQueueManager, req: APIRequest): Promise<AxiosResponse>;
    queue<T>(req: APIRequest): Promise<AxiosResponse<T>>;
    private updateOffset;
}
export declare type RouteLike = `/${string}`;
export interface RateLimit {
    global: boolean;
    limit: number;
    /** The UNIX timestamp this rate limit expires at. */
    reset: number;
}
