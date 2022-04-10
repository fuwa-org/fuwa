import { ResponseData } from 'undici/types/dispatcher';
import { APIRequest } from './APIRequest.js';
import { BucketQueueManager } from './BucketQueueManager.js';
import { RESTClient } from './RESTClient';
export declare class RequestManager {
    #private;
    client: RESTClient;
    _client?: any;
    limit: number;
    offset: number;
    buckets: Map<string, BucketQueueManager>;
    remaining: number;
    reset: number;
    constructor(client: RESTClient, _client?: any);
    get durUntilReset(): number;
    getBucket(route: RouteLike): string[];
    get globalLimited(): boolean;
    makeRequest(bucket: BucketQueueManager, requestData: APIRequest): Promise<ResponseData>;
    queue<T>(route: RouteLike, options?: Omit<APIRequest, 'route'>): Promise<Response<T>>;
    queue<T>(req: APIRequest): Promise<Response<T>>;
    private updateOffset;
    private debug;
    private trace;
}
export declare type RouteLike = `/${string}`;
export declare type Response<T> = ResponseData & {
    body: {
        json(): Promise<T>;
    };
};
export declare function consumeJSON<D = any>(res: ResponseData & {
    body: {
        json(): Promise<D>;
    };
}): Promise<D>;
