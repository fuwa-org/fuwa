import { Intents } from '../ws/intents';
import { ILogger } from '../logging/ILogger.js';
import { LoggerOptions } from '../logging/LoggerOptions.js';
export declare const pkg: any;
export interface ClientOptions {
    intents?: ClientOptionsIntents;
    logger?: boolean | ILogger | LoggerOptions;
    apiVersion?: number;
    httpBaseUrl?: string;
    httpUserAgent?: string;
    wsBrowser?: string;
    wsDevice?: string;
    wsOS?: string;
    compress?: boolean;
    etf?: boolean;
}
export declare type ClientOptionsIntents = number | Intents | (number | Intents)[];
export declare function resolveIntents(intents: ClientOptionsIntents): Intents;
export declare const DefaultClientOptions: ClientOptions;
export declare type Snowflake = `${bigint}`;
