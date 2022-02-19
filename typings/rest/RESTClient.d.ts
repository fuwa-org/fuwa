import { AxiosRequestHeaders, AxiosResponse } from 'axios';
import { ClientOptions } from '../client/ClientOptions';
import { APIRequest } from './Request';
import { RouteLike } from './RequestManager.js';
export declare class RESTClient {
    #private;
    baseUrl: string;
    options: RESTClientOptions;
    version?: number;
    constructor(options: RESTClientOptions);
    static createRESTOptions(clientOptions: ClientOptions, token: string, tokenType: 'Bot' | 'Bearer'): RESTClientOptions;
    createHeaders(): AxiosRequestHeaders;
    execute<T = any>(request: APIRequest): Promise<AxiosResponse<T>>;
    formatRoute(route: RouteLike): string;
}
export interface RESTClientOptions {
    baseUrl: string;
    version?: number;
    auth?: string;
    userAgent?: string;
    headers?: AxiosRequestHeaders;
}
