import { ResponseData } from 'undici/types/dispatcher';
import { APIRequest } from './APIRequest';
import { RouteLike } from './RequestManager.js';
export declare class RESTClient {
    #private;
    baseURL?: string;
    version?: number;
    options: RESTClientOptions;
    constructor(options: RESTClientOptions);
    static createRESTOptions(clientOptions: any, token: string, tokenType: 'Bot' | 'Bearer'): RESTClientOptions;
    static getDefaultOptions(token: string): Required<RESTClientOptions>;
    setAuth(auth?: string): this;
    getAuth(): string | undefined;
    createHeaders(request: APIRequest): Record<string, string>;
    formatRoute(route: RouteLike, versioned?: boolean, useBase?: boolean): string;
    resolveBody(req: APIRequest): APIRequest;
    createURL(request: APIRequest): string;
    execute(request: APIRequest, tracefunc?: any): Promise<ResponseData>;
}
export interface RESTClientOptions {
    baseURL?: string;
    version?: number;
    auth?: string;
    userAgent?: string;
    headers?: Record<string, string>;
}
