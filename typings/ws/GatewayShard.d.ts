/// <reference types="node" />
import { Snowflake, GatewayReceivePayload, GatewaySendPayload } from 'discord-api-types/v10';
import { Client } from '../client/Client';
import EventEmitter from 'node:events';
export interface Erlpack {
    pack(data: any): Buffer;
    unpack<T>(data: Buffer): T;
}
export declare enum ShardState {
    Disconnected = 0,
    Connecting = 1,
    Reconnecting = 2,
    Identifying = 3,
    Ready = 4,
    Resuming = 5,
    GuildsReady = 6,
    Available = 7
}
export declare class GatewayShard extends EventEmitter {
    #private;
    client: Client;
    readonly shard: [number, number];
    private _socket;
    private messageQueueCount;
    compress: boolean;
    erlpack: boolean;
    id: number;
    private heartbeat_interval;
    private heartbeat_at;
    private heartbeat_acked;
    url: string;
    ping: number;
    seq: number;
    session?: string;
    _awaitedGuilds: Snowflake[];
    get readyState(): 0 | 1 | 2 | 3;
    state: ShardState;
    constructor(client: Client, shard: [number, number]);
    private authenticate;
    connect(url?: string): Promise<unknown>;
    reset(full?: boolean): void;
    debug(...data: any[]): void;
    trace(...data: any[]): void;
    debugPretty(message: string, data: Record<string, any>): void;
    warn(...data: any[]): void;
    error(...data: any[]): void;
    awaitPacket(filter: (payload: GatewayReceivePayload) => boolean): Promise<unknown>;
    private onMessage;
    ready(): true | undefined;
    send(packet: GatewaySendPayload): Promise<void>;
    heartbeat(): void;
    close(resume?: boolean): void;
    reconnect(): void;
    private startHeartbeat;
    setTimeout(func: (...args: any[]) => any, timeout: number): number;
}
