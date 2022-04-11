/// <reference types="node" />
/// <reference types="node" />
import { GatewayReceivePayload, GatewaySendPayload } from 'discord-api-types/v10';
import { Client } from '../client/Client';
import EventEmitter from 'node:events';
export interface Erlpack {
    pack(data: any): Buffer;
    unpack<T>(data: Buffer): T;
}
export declare class GatewayShard extends EventEmitter {
    #private;
    client: Client;
    readonly shard: [number, number];
    private _socket?;
    private messageQueueCount;
    compress: boolean;
    erlpack: boolean;
    id: number;
    private heartbeat_interval;
    private heartbeat_at;
    private heartbeat_acked;
    url: string;
    ping: number;
    private s;
    session?: string;
    private _awaitedGuilds;
    constructor(client: Client, shard: [number, number], token: string);
    private authenticate;
    connect(url?: string): Promise<void>;
    reset(full?: boolean): void;
    debug(...data: any[]): void;
    private trace;
    private debugPretty;
    awaitPacket(filter: (payload: GatewayReceivePayload) => boolean): Promise<unknown>;
    private onMessage;
    send(packet: GatewaySendPayload): Promise<void>;
    heartbeat(): void;
    close(resume?: boolean): void;
    private _terminate;
    reconnect(): void;
    private startHeartbeat;
}
