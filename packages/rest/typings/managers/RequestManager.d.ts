import Dispatcher from 'undici/types/dispatcher';
import { APIRequest } from '../client/APIRequest';
import { BucketQueueManager } from './BucketQueueManager';
import { RESTClient } from '../client/RESTClient';
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
    init: RequestManagerOptions;
    limit: number;
    offset: number;
    buckets: Map<string, BucketQueueManager>;
    remaining: number;
    reset: number;
    constructor(client: RESTClient, init?: RequestManagerOptions);
    get durUntilReset(): number;
    getBucket(route: RouteLike): string[];
    get limited(): boolean;
    makeRequest(bucket: BucketQueueManager, req: Required<APIRequest>): Promise<Dispatcher.ResponseData>;
    queue<T = unknown, B = any>(route: RouteLike, options?: Omit<APIRequest<B>, 'route'>): Promise<Response<T>>;
    queue<T = unknown, B = any>(req: APIRequest<B>): Promise<Response<T>>;
    private updateOffset;
    private updateHeaders;
    __log_header(): string;
    debug(...args: any[]): void;
    private trace;
}
export type RouteLike = `/${string}`;
export type Response<T> = Dispatcher.ResponseData & {
    body: {
        json(): Promise<T>;
    };
};
export declare function consumeJSON<D = any>(res: Dispatcher.ResponseData & {
    body: {
        json(): Promise<D>;
    };
}): Promise<D>;
