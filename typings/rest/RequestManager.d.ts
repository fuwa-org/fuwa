import { AxiosResponse } from 'axios';
import { Client } from '../client/Client.js';
import { BucketQueueManager } from './BucketQueueManager.js';
import { APIRequest } from './Request';
import { RESTClient } from './RESTClient';
export declare class RequestManager {
    client: RESTClient;
    _client: Client;
    limit: number;
    offset: number;
    private queues;
    remaining: number;
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
    reset: number;
}
