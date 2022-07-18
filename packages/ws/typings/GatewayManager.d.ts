/// <reference types="node" />
import { REST } from '@fuwa/rest';
import { APIGatewayBotInfo } from 'discord-api-types/v10';
import EventEmitter from 'node:events';
import { GatewayShard } from './GatewayShard.js';
export declare class GatewayManager extends EventEmitter {
    #private;
    rest: REST;
    options: {
        apiVersion: number;
        intents: number;
    };
    shards: Map<number, GatewayShard>;
    count: number;
    gateway: APIGatewayBotInfo;
    get ping(): number;
    private concurrency;
    private _lastIdentify;
    private lock;
    constructor(rest: REST, options: {
        apiVersion: number;
        intents: number;
    }, token: string);
    shard(id: number): GatewayShard | undefined;
    spawnWithShardingManager(options: GatewayManagerShardingOptions): Promise<void>;
    spawn(options: GatewayManagerOptions): Promise<void>;
    respawn(id: number): Promise<boolean>;
    recalculate(amount: number): Promise<void>;
    recalculate(info: APIGatewayBotInfo): Promise<void>;
    private _registerListeners;
    private onClose;
    private fetchGatewayBot;
    private constructGatewayURL;
    reset(): void;
    event(name: string, ...data: any[]): void;
}
export interface GatewayManagerShardingOptions extends Omit<GatewayManagerOptions, 'shards' | 'id' | 'count'> {
    mode: 'env' | 'worker';
    workerData?: GatewayManagerShardingWorkerData;
}
export interface GatewayManagerShardingWorkerData {
    count: number;
    range?: [number, number];
    id?: number;
    increment?: number;
    limitPerWorker?: number;
}
export interface GatewayManagerOptions {
    shards: 'auto' | 1 | [number, number];
    id?: number;
    count?: number;
    url?: string;
    skipExisting?: boolean;
    trimExisting?: boolean;
}
