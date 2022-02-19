import { RESTClient } from "../rest/RESTClient";
import { ClientOptions } from "./ClientOptions";
export declare class Client {
    #private;
    options: ClientOptions;
    http: RESTClient;
    constructor(token: string, options?: ClientOptions);
    connect(): Promise<void>;
}
