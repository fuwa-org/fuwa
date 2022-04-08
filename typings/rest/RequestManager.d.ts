import { ResponseData } from 'undici/types/dispatcher';
import { APIRequest } from './APIRequest.js';
import { BucketQueueManager } from './BucketQueueManager.js';
import { RESTClient } from './RESTClient';
export declare class RequestManager {
    #private;
    client: RESTClient;
    _client?: any;
    /** The total amount of requests we can make until we're globally rate-limited. */
    limit: number;
    /** The time offset between us and Discord. */
    offset: number;
    /** Queue managers for different buckets */
    buckets: Map<string, BucketQueueManager>;
    /** The remaining requests we can make until we're globally rate-limited. */
    remaining: number;
    /** When the global rate limit will reset. */
    reset: number;
    constructor(client: RESTClient, _client?: any);
    get durUntilReset(): number;
    getBucket(route: RouteLike): string[];
    get globalLimited(): boolean;
    makeRequest(bucket: BucketQueueManager, requestData: APIRequest): Promise<ResponseData>;
    queue<T>(req: APIRequest | RouteLike): Promise<ResponseData & {
        body: {
            json(): Promise<T>;
        };
    }>;
    private updateOffset;
    private debug;
}
export declare type RouteLike = `/${string}`;
export declare function consumeJSON<D>(res: ResponseData & {
    body: {
        json(): Promise<D>;
    };
}): Promise<D>;
