import { AxiosRequestHeaders, AxiosResponse } from "axios";
import { ClientOptions } from "../client/ClientOptions";
import { APIRequest } from "./Request";
export declare class RESTClient {
    baseUrl: string;
    version?: number;
    auth?: string;
    options: RESTClientOptions;
    static createRESTOptions(clientOptions: ClientOptions, token: string, tokenType: "Bot" | "Bearer"): RESTClientOptions;
    constructor(options: RESTClientOptions);
    execute<T = any>(request: APIRequest): Promise<AxiosResponse<T>>;
    formatRoute(route: string): string;
    createHeaders(): AxiosRequestHeaders;
}
export interface RESTClientOptions {
    baseUrl: string;
    version?: number;
    auth?: string;
    userAgent?: string;
    headers?: AxiosRequestHeaders;
}
