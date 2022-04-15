import { Intents } from '../util/bitfields/Intents';
import { ILogger } from '../logging/ILogger.js';
import { LoggerOptions } from '../logging/LoggerOptions.js';
import { Erlpack } from '../ws/GatewayShard.js';
export declare const pkg: any;
export interface ClientOptions {
    intents?: ClientOptionsIntents;
    logger?: boolean | ILogger | LoggerOptions;
    apiVersion?: number;
    httpBaseUrl?: string;
    httpUserAgent?: string;
    httpTimings?: boolean;
    wsBrowser?: string;
    wsDevice?: string;
    wsOS?: string;
    compress?: boolean;
    etf?: boolean | Erlpack;
}
export declare type ClientOptionsIntents = number | Intents | (number | Intents)[];
export declare function resolveIntents(intents: ClientOptionsIntents): Intents;
export declare const DefaultClientOptions: ClientOptions;
export declare type Snowflake = `${bigint}`;
