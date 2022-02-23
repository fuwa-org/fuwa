import { ResponseData } from 'undici/types/dispatcher';
import { Client } from '../client/Client.js';
import { APIRequest } from './APIRequest.js';
import { BucketQueueManager } from './BucketQueueManager.js';
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
    makeRequest(bucket: BucketQueueManager, requestData: APIRequest): Promise<ResponseData>;
    queue(req: APIRequest): Promise<ResponseData>;
    private updateOffset;
}
export declare type RouteLike = `/${string}`;
