import {
  APIGatewayBotInfo,
  GatewayCloseCodes,
  Routes,
} from 'discord-api-types/v10';
import EventEmitter from 'node:events';
import { Client } from '../client/Client.js';
import { consumeJSON } from '../rest/RequestManager.js';
import { Intents } from '../util/bitfields/Intents.js';
import { GatewayShard } from './GatewayShard.js';
import WebSocket from 'ws';

/**
 * The Gateway Manager is responsible for managing the client's {@link GatewayShard}s.
 */
export class GatewayManager extends EventEmitter {
  shards: Map<number, GatewayShard> = new Map();
  count = 0;

  gateway!: APIGatewayBotInfo;

  /**
   * The average latency of all the client's shards, in milliseconds.
   */
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

  /**
   * Retrieve a shard by its ID.
   */
  public shard(id: number) {
    return this.shards.get(id);
  }

  /**
   * Used internally to handle data passed from {@link ShardingManager}s.
   */
  public spawnWithShardingManager(options: GatewayManagerShardingOptions) {
    if (options.mode === 'env') {
      if ('__FUWA_SHARD_ID' in process.env) {
        return this.spawn({
          ...options,
          shards: 1,
          id: parseInt(process.env.__FUWA_SHARD_ID!),
          count: parseInt(process.env.__FUWA_SHARD_COUNT!),
        });
      } else if (process.env.__FUWA_SHARD_RANGE) {
        const [start, end] = process.env.__FUWA_SHARD_RANGE.split('-');
        return this.spawn({
          ...options,
          shards: [+start, +end - 1],
          id: parseInt(start),
          count: parseInt(end) - parseInt(start) + 1,
        });
      } else if ('__FUWA_SHARD_INCREMENT' in process.env) {
        return this.spawn({
          ...options,
          shards: [
            +process.env.__FUWA_SHARD_INCREMENT!,
            +process.env.__FUWA_SHARD_INCREMENT! +
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
      } else if ('id' in data) {
        return this.spawn({
          ...options,
          shards: 1,
          id: data.id,
          count: data.count,
        });
      } else if ('increment' in data) {
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

  /**
   * Spawn a single shard, a range of shards, or all shards for a {@link Client}.
   * @param options Options to determine how to spawn the shards. The only required option is
   * `shards`, but depending on the value of `shards`, other options may be required.
   *
   * @example ```js
   * // spawns a single shard
   * GatewayManager.spawn({
   *   shards: 1,
   *   id: 0,
   * });
   *
   * // spawns a range of shards
   * GatewayManager.spawn({
   *   shards: [0, 3],
   * });
   *
   * // automatically determines how many shards to spawn
   * GatewayManager.spawn({
   *   shards: 'auto',
   *  });
   * ```
   */
  public async spawn(options: GatewayManagerOptions) {
    let range = [0, 1];
    let count = options.count ?? null;
    const gateway = (this.gateway =
      this.gateway ?? (await this.fetchGatewayBot()));
    count = count ?? gateway.shards;

    if (options.shards === 'auto') {
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
      const shard = new GatewayShard(this.client, [i, count]);
      this._registerListeners(shard);
      try {
        await shard.connect(
          this.constructGatewayURL(options.url ?? this.gateway.url),
        );
      } catch (e) {
        this.error('failed to spawn shard', i, e);
      } finally {
        this.shards.set(i, shard);
      }
    }

    this.count = range[1];
  }

  /**
   * Respawn a shard.
   *
   * @returns Whether the shard was successfully respawned.
   */
  public async respawn(id: number) {
    const shard = this.shards.get(id);

    if (!shard) return false;

    shard.close(false);
    shard.reset(true);
    this.shards.delete(shard.id);
    this.spawn({
      shards: 1,
      id: shard.id,
      url: shard.url,
      count: this.count,
    });
    return true;
  }

  /** @internal */
  private _registerListeners(shard: GatewayShard) {
    shard
      .on('_refresh', () => {
        this.debug('refreshing shard', shard.id);
        this.respawn(shard.id);
      })
      .on('_throw', e => {
        throw new Error(`Shard ${shard.id}: ${e}`);
      })
      .on('packet', p => {
        this.emit('packet', p, shard);
      })
      .on('dispatch', d => {
        this.emit('dispatch', d, shard);
      })
      .on('close', (code, reason) => {
        this.onClose(shard, code, reason.toString());
      });
    return shard;
  }

  /** @internal */
  private onClose(shard: GatewayShard, code: number, reason: string) {
    this.debug(
      `Shard ${shard.id} closed with code`,
      code,
      `reason`,
      reason?.toString() ?? GatewayCloseCodes[code],
    );
    switch (code) {
      case GatewayCloseCodes.InvalidIntents:
        throw new Error(
          `Gateway intents ${this.client.options.intents} are invalid.`,
        );
      case GatewayCloseCodes.InvalidShard:
        throw new Error('Invalid shard id: ' + shard.id);
      case GatewayCloseCodes.DisallowedIntents: {
        const err = new Error(
          `Gateway intents ${this.client.options.intents} are disallowed for the client.`,
        ) as any;

        err.intents = (this.client.options.intents as Intents).toArray();

        throw err;
      }
      case GatewayCloseCodes.AuthenticationFailed:
        throw new Error('Client token is invalid');
      case 1000:
      case GatewayCloseCodes.InvalidSeq:
      case GatewayCloseCodes.SessionTimedOut:
        shard.emit('_refresh');
        break;
      // eslint-disable-next-line no-fallthrough
      default:
        this.debug('Socket closed, reconnecting...');
        shard.reconnect();
        break;
    }
  }

  /**
   * Fetch gateway information for the client.
   */
  private async fetchGatewayBot() {
    return this.client.http
      .queue<APIGatewayBotInfo>(Routes.gatewayBot())
      .then(consumeJSON);
  }

  private constructGatewayURL(url: string) {
    const parsed = new URL(url);
    parsed.searchParams.set(
      'encoding',
      this.client.options.etf ? 'etf' : 'json',
    );
    parsed.searchParams.set('v', this.client.options.apiVersion.toString());

    return parsed.toString();
  }

  /**
   * Perform a full reset of every shard. This should be used sparingly,
   * as it will not reconnect to the gateway.
   */
  reset() {
    for (const shard of this.shards.values()) {
      shard.close(false);
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
  url?: string;
}
