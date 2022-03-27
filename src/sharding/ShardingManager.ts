import { APIGatewayBotInfo, Routes } from '@splatterxl/discord-api-types';
import { ChildProcess, fork } from 'child_process';
import { isMainThread, Worker } from 'worker_threads';
import { resolveRequest } from '../rest/APIRequest';
import { consumeJSON } from '../rest/RequestManager';
import { RESTClient } from '../rest/RESTClient';

export class ShardingManager {
  gatewayInfo!: APIGatewayBotInfo;
  client: RESTClient;
  workers: Map<number, ChildProcess | Worker> = new Map();

  constructor(public token: string, public options: ShardingManagerOptions) {
    this.client = new RESTClient(RESTClient.getDefaultOptions(token));
  }

  public async spawn() {
    this.gatewayInfo = await this.client
      .execute(resolveRequest({ route: Routes.gatewayBot() }))
      .then(consumeJSON);

    const { totalShards = this.gatewayInfo.shards } = this.options;

    const shards = Array.isArray(this.options.shards)
      ? this.options.shards
      : this.options.shards === 'auto'
      ? range(totalShards - 1)
      : typeof this.options.shards === 'number'
      ? range(this.options.increment ?? 0, this.options.shards - 1)
      : null;

    if (!shards) throw new Error('Invalid shards option');

    const _ = [...new Set(shards)];

    switch (this.options.mode) {
      case 'process':
        for (const i of _) {
          console.debug(`[ShardingManager] Spawning process for shard ${i}`);
          this.workers.set(i, this.spawnProcess(i));
        }
        break;
      case 'worker':
        for (const i of _) {
          console.debug(`[ShardingManager] Spawning worker for shard ${i}`);
          this.workers.set(i, this.spawnWorker(i));
        }
        break;
      default:
        throw new Error('Invalid mode option');
    }

    process.on('exit', () => {
      console.log('[ShardingManager] Shutting down');
      for (const [id, worker] of this.workers) {
        if (worker instanceof ChildProcess) {
          worker.kill();
        } else {
          worker.terminate();
        }
        console.log(`[ShardingManager] Killed worker ${id}`);
      }
    });
  }

  private spawnProcess(id: number) {
    const worker = fork(this.options.file, this.options.shardArgs ?? [], {
      env: {
        ...process.env,
        __FUWA_SHARD_ID: id.toString(),
        __FUWA_SHARD_COUNT: this.gatewayInfo.shards.toString(),
        __FUWA_SHARDING_MANAGER: 'true',
      },
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(
          `[ShardingManager] Worker ${id} exited with code ${code}, respawning`
        );
        this.respawn(id);
      } else {
        console.log(
          `[ShardingManager] Worker ${id} exited with success code ${code}`
        );
      }
    });

    return worker;
  }

  private spawnWorker(id: number) {
    if (!isMainThread) throw new Error('Cannot spawn worker in worker thread');

    const worker = new Worker(this.options.file, {
      workerData: {
        id,
        count: this.gatewayInfo.shards,
        __fuwa_sharding_manager: true,
      },
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(
          `[ShardingManager] Worker ${id} exited with code ${code}, respawning`
        );
        this.respawn(id);
      } else {
        console.log(
          `[ShardingManager] Worker ${id} exited with success code ${code}`
        );
      }
    });

    return worker;
  }

  respawn(id: number) {
    switch (this.options.mode) {
      case 'process':
        this.workers.set(id, this.spawnProcess(id));
        break;
      case 'worker':
        this.workers.set(id, this.spawnWorker(id));
        break;
    }
  }

  handleMessage(d: any, id: number) {
    console.log(`[ShardingManager] Received message from worker ${id}:`, d);

    const buf = Buffer.from(d.toString());

    switch (buf.at(0)) {
      case 1:
        this.respawn(id);
        break;
    }
  }
}

export interface ShardingManagerOptions {
  token: string;
  shards: number | 'auto' | number[];
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

function range(start: number, end: number = start) {
  return Array.from(new Array(end - start + 1), (x, i) => i + start);
}
