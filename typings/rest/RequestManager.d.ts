import { APIRequest } from "./Request";
import { RESTClient } from "./RESTClient";
export declare class RequestManager {
    client: RESTClient;
    private buckets;
    private queues;
    constructor(client: RESTClient);
    queue(req: APIRequest): void;
    getBucket(route: RouteLike): string;
}
export declare type RouteLike = `/${string}`;
export interface RateLimit {
    global: boolean;
    limit: number;
    reset: number;
}
