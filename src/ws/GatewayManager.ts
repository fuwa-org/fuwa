import { APIGatewayBotInfo, Routes } from '@splatterxl/discord-api-types';
import { Client } from '../client/Client.js';
import { consumeJSON } from '../index.js';
import { GatewayShard } from './GatewayShard.js';

export class GatewayManager {
  shards: Map<number, GatewayShard> = new Map();

  constructor(private client: Client) {}

  #__log_header() {
    return `[${this.client.logger.kleur().blue('WS')} => ${this.client.logger
      .kleur()
      .green('Manager')}]`;
  }

  private debug(...args: any[]) {
    this.client.logger.debug(this.#__log_header(), ...args);
  }

  private error(...args: any[]) {
    this.client.logger.error(this.#__log_header(), ...args);
  }

  public spawnWithShardingManager(options: GatewayManagerShardingOptions) {
    if (options.mode === 'env') {
      if (process.env.__FUWA_SHARD_ID)
        return this.spawn({
          ...options,
          shards: 1,
          id: parseInt(process.env.__FUWA_SHARD_ID),
          count: parseInt(process.env.__FUWA_SHARD_COUNT!),
        });
      else if (process.env.__FUWA_SHARD_RANGE) {
        const [start, end] = process.env.__FUWA_SHARD_RANGE.split('-');
        return this.spawn({
          ...options,
          shards: [+start, +end - 1],
          id: parseInt(start),
          count: parseInt(end) - parseInt(start) + 1,
        });
      } else if (process.env.__FUWA_SHARD_INCREMENT) {
        return this.spawn({
          ...options,
          shards: [
            +process.env.__FUWA_SHARD_INCREMENT,
            +process.env.__FUWA_SHARD_INCREMENT +
              +process.env.__FUWA_SHARD_LIMIT_PER_WORKER!,
          ],
          count: parseInt(process.env.__FUWA_SHARD_COUNT!),
        });
      } else {
        throw new Error('invalid sharding environment');
      }
    } else if (options.mode === 'worker') {
      const data = options.workerData!;

      if (data.range) {
        return this.spawn({
          ...options,
          shards: data.range,
          count: data.count,
        });
      } else if (data.id) {
        return this.spawn({
          ...options,
          shards: 1,
          id: data.id,
          count: data.count,
        });
      } else if (data.increment) {
        return this.spawn({
          ...options,
          shards: [data.increment, data.increment + data.limitPerWorker!],
          count: data.count,
        });
      } else {
        throw new Error('invalid sharding worker data');
      }
    } else {
      throw new Error('invalid sharding mode');
    }
  }

  public async spawn(options: GatewayManagerOptions) {
    let range = [0, 1];
    let count = options.count ?? 0;

    if (options.shards === 'auto') {
      const gateway = await this.fetchGatewayBot();

      this.debug('automatically assuming shard count:', gateway.shards);

      range = [0, gateway.shards];
      count = gateway.shards;
    } else if (Array.isArray(options.shards)) {
      range = options.shards;
    } else if (options.shards === 1) {
      range = [options.id!, options.id! + 1];
    }

    this.debug('spawning shards:', range.join('..'), '(' + count + ')');

    for (let i = range[0]; i !== range[1]; i++) {
      const shard = new GatewayShard(this.client, [i, count], options.token);
      this._registerListeners(shard);
      try {
        await shard.connect(options.url);
      } catch (e) {
        this.error('failed to spawn shard', i, e);
      } finally {
        this.shards.set(i, shard);
      }
    }
  }

  private _registerListeners(shard: GatewayShard) {
    shard
      .on('ready', () => {
        this.debug('shard ready:', shard.id);
      })
      .on('disconnect', () => {
        this.debug('shard disconnected:', shard.id);
      })
      .on('reconnect', () => {
        this.debug('shard reconnected:', shard.id);
      })
      .on('resume', () => {
        this.debug('shard resumed:', shard.id);
      })
      .on('invalid', () => {
        this.error('shard invalid:', shard.id);
      })
      .on('close', () => {
        this.debug('shard closed:', shard.id);
      });
    return shard;
  }

  private async fetchGatewayBot() {
    return this.client.http
      .queue<APIGatewayBotInfo>(Routes.gatewayBot())
      .then(consumeJSON);
  }

  reset() {
    for (const shard of this.shards.values()) {
      shard.reset(true);
    }

    this.shards.clear();
  }
}

export interface GatewayManagerShardingOptions
  extends Omit<GatewayManagerOptions, 'shards' | 'id' | 'count'> {
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
  url: string;
  token: string;
}
