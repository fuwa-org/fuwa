import { Intents } from '../ws/intents';
export interface ClientOptions {
    intents?: ClientOptionsIntents;
    apiVersion?: number;
    httpBaseUrl?: string;
    httpUserAgent?: string;
    compress?: boolean;
    etf?: boolean;
}
export declare type ClientOptionsIntents = number | Intents | (number | Intents)[];
export declare function resolveIntents(intents: ClientOptionsIntents): Intents;
export declare const DefaultClientOptions: ClientOptions;
export declare type Snowflake = `${bigint}`;
