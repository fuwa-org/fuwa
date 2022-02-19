import { AxiosRequestHeaders, AxiosResponse } from 'axios';
import { ClientOptions } from '../client/ClientOptions';
import { APIRequest } from './Request';
import { RouteLike } from './RequestManager.js';
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
    createHeaders(): AxiosRequestHeaders;
    execute<T = any>(request: APIRequest): Promise<AxiosResponse<T>>;
    formatRoute(route: RouteLike): string;
}
export interface RESTClientOptions {
    baseUrl: string;
    version?: number;
    auth?: string;
    userAgent?: string;
    /** Additional headers to send */
    headers?: AxiosRequestHeaders;
}
