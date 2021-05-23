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
export declare class Client extends EventEmitter {
    guilds: Collection<`${bigint}`, APIUnavailableGuild | APIGuild | (APIUnavailableGuild & {
        uncached: true;
    })>;
    intervals: NodeJS.Timeout[];
    options: ClientOptions;
    rest: RESTManager;
    timeouts: NodeJS.Timeout[];
    token: string;
    user: User;
    ws: WebSocketManager;
    constructor(token: string, options: ClientOptions);
    private _connect;
    private _request;
    get connect(): WebSocketManager['connect'];
    destroy(): void;
    get request(): RESTManager['request'];
}
