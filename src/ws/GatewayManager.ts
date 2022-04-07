import { APIGatewayBotInfo, GatewayCloseCodes, Routes } from '@splatterxl/discord-api-types';
import EventEmitter from 'node:events';
import { Client } from '../client/Client.js';
import { consumeJSON } from '../rest/RequestManager.js';
import { GatewayShard } from './GatewayShard.js';

export class GatewayManager extends EventEmitter {
  shards: Map<number, GatewayShard> = new Map();

  get ping() {
    let val = 0;

    for (const shard of this.shards.values()) {
      val += shard.ping;
    }

    return val / this.shards.size;
  }

  constructor(public client: Client) {
    super();

    Object.defineProperty(this, 'client', {
      value: this.client,
      enumerable: false,
    });
  }

  #__log_header() {
    return `[${this.client.logger.kleur().blue('WS')} => ${this.client.logger
      .kleur()
      .green('Manager')}]`;
  }

  debug(...args: any[]) {
    this.client.logger.debug(this.#__log_header(), ...args);
  }

  error(...args: any[]) {
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
      } else if ("id" in data) {
        return this.spawn({
          ...options,
          shards: 1,
          id: data.id,
          count: data.count,
        });
      } else if ("increment" in data) {
        return this.spawn({
          ...options,
          shards: [data.increment!, data.increment! + data.limitPerWorker!],
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
      .on('_refresh', () => {
        this.debug('refreshing shard', shard.id);
        shard.close(false);
        shard.reset(true);
        this.shards.delete(shard.id);
        this.spawn({
          shards: 1,
          id: shard.id,
          token: shard.client.token(false),
          url: shard.url,
        });
      })
      .on('_throw', (e) => {
        throw new Error(`Shard ${shard.id}: ${e}`);
      })
      .on("packet", (p) => {
        this.emit("packet", p, shard);
      })
      .on("dispatch", (d) => {
        this.emit("dispatch", d, shard);
      })
      .on("close", (code, reason) => {
        this.onClose(shard, code, reason.toString());
      });
    return shard;
  }

  private onClose(shard: GatewayShard, code: number, reason: string) {
    this.debug(
      `Shard ${shard.id} closed with code`,
      code,
      `reason`,
      reason?.toString() ?? GatewayCloseCodes[code]
    );
    switch (code) {
      case GatewayCloseCodes.InvalidIntents:
        throw new Error(
          `Gateway intents ${this.client.options.intents} are invalid.`
        );
      case GatewayCloseCodes.InvalidShard:
        throw new Error('Invalid shard id: ' + shard.id);
      case GatewayCloseCodes.DisallowedIntents:
        throw new Error(
          `Gateway intents ${this.client.options.intents} are disallowed for the client.`
        );
      case GatewayCloseCodes.AuthenticationFailed:
        throw new Error('Client token is invalid');
      case 1000:
      case GatewayCloseCodes.InvalidSeq:
      case GatewayCloseCodes.SessionTimedOut:
        shard.emit("_refresh");
        break;
      // eslint-disable-next-line no-fallthrough
      default:
        this.debug('Socket closed, reconnecting...');
        shard.reconnect();
        break;
    }
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
