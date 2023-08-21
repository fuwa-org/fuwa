import Dispatcher from 'undici/types/dispatcher';
import { APIRequest } from './APIRequest';
import { RouteLike } from '../managers/RequestManager';
export declare class RESTClient {
    #private;
    baseURL?: string;
    version?: number;
    private readonly options;
    constructor(options: RESTClientOptions);
    static createRESTOptions(clientOptions: RESTClientOptions, token: string, tokenType: 'Bot' | 'Bearer'): RESTClientOptions;
    static getDefaultOptions(): Exclude<RESTClientOptions, 'auth'>;
    setAuth(auth?: string): this;
    getAuth(): string | undefined;
    createHeaders(request: APIRequest): Record<string, string>;
    formatRoute(route: RouteLike, versioned?: boolean, useBase?: boolean): string;
    resolveBody(req: APIRequest): APIRequest;
    createURL(request: APIRequest): string;
    execute(request: APIRequest, tracefunc?: any): Promise<Dispatcher.ResponseData>;
}
export interface RESTClientOptions {
    baseURL?: string;
    version?: number;
    auth?: string;
    userAgent?: string;
    headers?: Record<string, string>;
}
