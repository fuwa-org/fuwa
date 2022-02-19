import { AxiosResponse } from 'axios';
import { BucketQueueManager } from './BucketQueueManager.js';
import { APIRequest } from './Request';
import { RESTClient } from './RESTClient';
export declare class RequestManager {
    client: RESTClient;
    limit: number;
    offset: number;
    private queues;
    remaining: number;
    reset: number;
    constructor(client: RESTClient);
    get durUntilReset(): number;
    getBucket(route: RouteLike): string[];
    get globalLimited(): boolean;
    makeRequest(bucket: BucketQueueManager, req: APIRequest): Promise<AxiosResponse>;
    queue(req: APIRequest): Promise<AxiosResponse>;
    private updateOffset;
}
export declare type RouteLike = `/${string}`;
export interface RateLimit {
    global: boolean;
    limit: number;
    reset: number;
}
