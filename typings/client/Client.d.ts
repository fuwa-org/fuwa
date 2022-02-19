import { RequestManager } from '../rest/RequestManager.js';
import { ClientOptions } from './ClientOptions';
export declare class Client {
    #private;
    http: RequestManager;
    options: ClientOptions;
    constructor(token: string, options?: ClientOptions);
    connect(): Promise<void>;
}
