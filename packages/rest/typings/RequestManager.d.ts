import { ResponseData } from 'undici/types/dispatcher';
import { APIRequest } from './APIRequest.js';
import { BucketQueueManager } from './BucketQueueManager.js';
import { RESTClient } from './RESTClient';
export interface RequestManagerOptions {
    timings?: boolean;
    logger?: {
        debug?: (...args: any[]) => void;
        trace?: (...args: any[]) => void;
        kleur?: any;
        header?: (() => string) | string;
    };
}
export declare class RequestManager {
    client: RESTClient;
    options: RequestManagerOptions;
    limit: number;
    offset: number;
    buckets: Map<string, BucketQueueManager>;
    remaining: number;
    reset: number;
    constructor(client: RESTClient, options?: RequestManagerOptions);
    get durUntilReset(): number;
    getBucket(route: RouteLike): string[];
    get limited(): boolean;
    makeRequest(bucket: BucketQueueManager, req: Required<APIRequest>): Promise<ResponseData>;
    queue<T>(route: RouteLike, options?: Omit<APIRequest, 'route'>): Promise<Response<T>>;
    queue<T>(req: APIRequest): Promise<Response<T>>;
    private updateOffset;
    private updateHeaders;
    __log_header(): string;
    debug(...args: any[]): void;
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
