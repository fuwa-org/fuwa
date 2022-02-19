import { AxiosRequestHeaders } from 'axios';
import { RouteLike } from './RequestManager.js';
import { RESTClient } from './RESTClient';
export declare class APIRequest {
    allowedRetries: number;
    data?: any;
    headers: AxiosRequestHeaders;
    method: HTTPMethod;
    retries: number;
    route: RouteLike;
    constructor(route: RouteLike, method?: string, allowedRetries?: number);
    static ensureMethod(str: string): HTTPMethod;
    static get(route: RouteLike): APIRequest;
    send(client: RESTClient): void;
}
declare type HTTPMethod = 'get';
export {};
