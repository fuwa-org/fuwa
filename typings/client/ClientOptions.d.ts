import { Intents } from '../ws/intents';
/** Options for {@link Client}s. For default values see {@link DefaultClientOptions} */
export interface ClientOptions {
    /**
     * The [Gateway Intents](https://discord.com/developers/docs/topics/gateway#list-of-intents) to use for this client.
     * @default {@link Intents.DEFAULT}
     */
    intents?: ClientOptionsIntents;
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
    /**
     * Whether to compress gateway packets. Requires [`zlib-sync`](https://npm.im/zlib-sync).
     * @default false
     */
    compress?: boolean;
    /**
     * Whether to use `erlpack` while processing gateway packets. Requires [the NPM package](https://npm.im/erlpack).
     * @default false
     */
    etf?: boolean;
}
export declare type ClientOptionsIntents = number | Intents | (number | Intents)[];
export declare function resolveIntents(intents: ClientOptionsIntents): Intents;
export declare const DefaultClientOptions: ClientOptions;
