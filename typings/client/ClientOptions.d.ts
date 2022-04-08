import { Intents } from '../util/bitfields/Intents';
import { ILogger } from '../logging/ILogger.js';
import { LoggerOptions } from '../logging/LoggerOptions.js';
import { Erlpack } from '../ws/GatewayShard.js';
export declare const pkg: any;
/** Options for {@link Client}s. For default values see {@link DefaultClientOptions} */
export interface ClientOptions {
    /**
     * The [Gateway Intents](https://discord.com/developers/docs/topics/gateway#list-of-intents) to use for this client.
     * @default {@link Intents.DEFAULT}
     */
    intents?: ClientOptionsIntents;
    logger?: boolean | ILogger | LoggerOptions;
    /**
     * The API version to use across the REST and WebSocket servers.
     * @default 9
     */
    apiVersion?: number;
    /**
     * Base URL for connecting to the Discord REST API. **DO NOT SPECIFY THE API VERSION IN THIS**
     * @default https://discord.com/api
     */
    httpBaseUrl?: string;
    httpUserAgent?: string;
    wsBrowser?: string;
    wsDevice?: string;
    wsOS?: string;
    /**
     * Whether to compress gateway packets. Requires [`zlib-sync`](https://npm.im/zlib-sync).
     * @default false
     */
    compress?: boolean;
    /**
     * Whether to use `erlpack` while processing gateway packets. Requires [the NPM package](https://npm.im/erlpack).
     * @default false
     */
    etf?: boolean | Erlpack;
}
export declare type ClientOptionsIntents = number | Intents | (number | Intents)[];
export declare function resolveIntents(intents: ClientOptionsIntents): Intents;
export declare const DefaultClientOptions: ClientOptions;
export declare type Snowflake = `${bigint}`;
