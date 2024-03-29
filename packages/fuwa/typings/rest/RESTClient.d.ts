import { ClientOptions } from '../client/ClientOptions';
import { APIRequest } from './APIRequest';
import { RouteLike } from './RequestManager.js';
import { ResponseData } from 'undici/types/dispatcher';
export declare class RESTClient {
    #private;
    baseURL: string;
    options: RESTClientOptions;
    version?: number;
    constructor(options: RESTClientOptions);
    static createRESTOptions(clientOptions: ClientOptions, token: string, tokenType: 'Bot' | 'Bearer'): RESTClientOptions;
    static getDefaultOptions(token: string): Required<RESTClientOptions>;
    createHeaders(request: APIRequest): Record<string, string>;
    formatRoute(route: RouteLike, versioned?: boolean, useBase?: boolean): string;
    resolveBody(req: APIRequest): APIRequest;
    createURL(request: APIRequest): string;
    execute(request: APIRequest, tracefunc?: any): Promise<ResponseData>;
}
export interface RESTClientOptions {
    baseURL: string;
    version?: number;
    auth?: string;
    userAgent?: string;
    headers?: Record<string, string>;
}
