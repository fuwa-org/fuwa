/// <reference types="node" />
import { GatewayReceivePayload, GatewaySendPayload, Snowflake } from 'discord-api-types/v10';
import EventEmitter from 'node:events';
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
    readonly shard: [number, number];
    readonly intents: number;
    private _socket;
    private messageQueueCount;
    id: number;
    private heartbeat_interval;
    private heartbeat_at;
    private heartbeat_acked;
    url: string;
    ping: number;
    seq: number;
    session?: string;
    _awaitedGuilds: Snowflake[];
    state: ShardState;
    constructor(shard: [number, number], intents: number, token: string);
    private authenticate;
    connect(url?: string): Promise<unknown>;
    reset(full?: boolean): void;
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
