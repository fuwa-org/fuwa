/// <reference types="node" />
/// <reference types="node" />
import { RESTClient } from '@fuwa/rest';
import { ChildProcess } from 'child_process';
import { APIGatewayBotInfo } from 'discord-api-types/v10';
import { Worker } from 'worker_threads';
export declare class ShardingManager {
    token: string;
    options: ShardingManagerOptions;
    gatewayInfo: APIGatewayBotInfo;
    client: RESTClient;
    workers: Map<number, ChildProcess | Worker>;
    constructor(token: string, options: ShardingManagerOptions);
    spawn(): Promise<void>;
    private spawnProcess;
    private spawnWorker;
    respawn(id: number): void;
    handleMessage(d: any, id: number): void;
}
export interface ShardingManagerOptions {
    token: string;
    shards: number | 'auto' | [number, number] | number[];
    fetchInfo?: boolean;
    totalShards?: number;
    limitPerWorker?: number;
    increment?: number;
    mode: 'process' | 'worker' | 'range';
    file: string;
    respawn?: boolean;
    autoSpawn?: boolean;
    shardArgs?: string[];
}
