/// <reference types="node" />
import { EventEmitter } from 'events';
import { RESTManager } from './rest';
import { User } from './structures/User';
import { WebSocketManager } from './ws';
import Collection from '@discordjs/collection';
import { APIGuild, APIUnavailableGuild } from 'discord-api-types';
export interface ClientOptions {
    intents: number;
}
export interface Client {
    token: string;
}
/** The main class of this wrapper and where all communication with Discord is based from.
 * <warning>Sharded clients are not supported by Wrappercord</warning>
 */
export declare class Client extends EventEmitter {
    /** Cached guilds the bot is in
     * <info>Every guild is cached by default in un-sharded clients</info>
     */
    guilds: Collection<`${bigint}`, APIUnavailableGuild | APIGuild | (APIUnavailableGuild & {
        uncached: true;
    })>;
    /** Intervals that can be cleared with `Client#destroy()`
     * @see Client#destroy
     */
    intervals: NodeJS.Timeout[];
    /** Options passed to the constructor.
     * @see Client
     */
    options: ClientOptions;
    /** The main HTTP request manager */
    rest: RESTManager;
    /** Timeouts that can be cleared with `Client#destroy()`
     * @see Client#destroy
     */
    timeouts: NodeJS.Timeout[];
    /** The client's User, returned by the READY dispatch */
    user: User;
    /** The WebSocket connection manager */
    ws: WebSocketManager;
    /**
     * @param token The Client's Bot token. **User tokens are not supported.**
     * @param options The options for this instance.
     */
    constructor(token: string, options: ClientOptions);
    private _connect;
    private _request;
    /** Connects to the API. */
    get connect(): WebSocketManager['connect'];
    /** Destroys the client, terminates the connection to Discord and nullifies the token. */
    destroy(): void;
    /** Make a request to the API. Rate-limits are cached and managed by this function. */
    get request(): RESTManager['request'];
}
