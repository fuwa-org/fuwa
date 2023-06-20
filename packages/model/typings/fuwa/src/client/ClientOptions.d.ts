import { ILogger } from '../logging/ILogger.js';
import { LoggerOptions } from '../logging/LoggerOptions.js';
import { Intents } from '../util/bitfields/Intents';
export declare const pkg: any;
export interface ClientOptions {
    token?: string;
    intents?: ClientOptionsIntents;
    logger?: boolean | ILogger | LoggerOptions;
    apiVersion?: number;
    httpBaseURL?: string;
    httpUserAgent?: string;
    httpTimings?: boolean;
    wsBrowser?: string;
    wsDevice?: string;
    wsOS?: string;
    compress?: boolean;
    etf?: boolean;
}
export type ClientOptionsIntents = number | Intents | (number | Intents)[];
export declare function resolveIntents(intents: ClientOptionsIntents): Intents;
export declare const DefaultClientOptions: ClientOptions;
