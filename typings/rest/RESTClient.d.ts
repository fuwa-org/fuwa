import { ClientOptions } from '../client/ClientOptions';
import { APIRequest } from './APIRequest';
import { RouteLike } from './RequestManager.js';
import { ResponseData } from 'undici/types/dispatcher';
export declare class RESTClient {
    #private;
    baseUrl: string;
    options: RESTClientOptions;
    version?: number;
    constructor(options: RESTClientOptions);
    static createRESTOptions(clientOptions: ClientOptions, token: string, tokenType: 'Bot' | 'Bearer'): RESTClientOptions;
    createHeaders(originalHeaders?: {}, auth?: boolean): Record<string, string>;
    formatRoute(route: RouteLike, versioned?: boolean): string;
    resolveBody(req: APIRequest): APIRequest;
    createURL(request: APIRequest): string;
    execute(request: APIRequest): Promise<ResponseData>;
}
export interface RESTClientOptions {
    baseUrl: string;
    version?: number;
    auth?: string;
    userAgent?: string;
    headers?: Record<string, string>;
}
