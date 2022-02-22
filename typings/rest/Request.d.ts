import { AxiosRequestHeaders, AxiosResponse } from 'axios';
import { RequestManager, RouteLike } from './RequestManager.js';
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
    send<T>(manager: RequestManager): Promise<AxiosResponse<T>>;
}
declare type HTTPMethod = 'get';
export {};
