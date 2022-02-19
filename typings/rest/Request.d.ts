import { AxiosRequestHeaders } from "axios";
import { RESTClient } from "./RESTClient";
export declare class APIRequest {
    route: string;
    method: HTTPMethod;
    data?: any;
    headers: AxiosRequestHeaders;
    static get(route: string): APIRequest;
    static ensureMethod(str: string): HTTPMethod;
    constructor(route: string, method?: string);
    send(client: RESTClient): void;
}
declare type HTTPMethod = "get";
export {};
