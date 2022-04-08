import { ClientOptions } from '../client/ClientOptions';
import { APIRequest } from './APIRequest';
import { RouteLike } from './RequestManager.js';
import { ResponseData } from 'undici/types/dispatcher';
/**
 * Utility class for easy HTTP requests to the Discord API. Can be used for other APIs if needed.
 */
export declare class RESTClient {
    #private;
    baseUrl: string;
    options: RESTClientOptions;
    /**
     * API version to add to the {@link RESTClient.baseUrl}. Leave empty to not add a version at all.
     */
    version?: number;
    constructor(options: RESTClientOptions);
    static createRESTOptions(clientOptions: ClientOptions, token: string, tokenType: 'Bot' | 'Bearer'): RESTClientOptions;
    static getDefaultOptions(token: string): Required<RESTClientOptions>;
    createHeaders(request: APIRequest): Record<string, string>;
    formatRoute(route: RouteLike, versioned?: boolean, useBase?: boolean): string;
    resolveBody(req: APIRequest): APIRequest;
    createURL(request: APIRequest): string;
    execute(request: APIRequest): Promise<ResponseData>;
}
export interface RESTClientOptions {
    baseUrl: string;
    version?: number;
    auth?: string;
    userAgent?: string;
    /** Additional headers to send */
    headers?: Record<string, string>;
}
