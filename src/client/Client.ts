import { APIRequest } from '../index.js';
import { RequestManager } from '../rest/RequestManager.js';
import { RESTClient } from '../rest/RESTClient';
import {
  ClientOptions,
  DefaultClientOptions,
  resolveIntents,
} from './ClientOptions';
import { APIGatewayBotInfo } from '@splatterxl/discord-api-types';
import EventEmitter from 'events';
import { GatewayShard } from '../ws/GatewayShard.js';

export class Client extends EventEmitter {
  #token: string;
  public http: RequestManager;
  public options: Required<ClientOptions>;

  public ws?: GatewayShard;

  public constructor(token: string, options?: ClientOptions) {
    super();

    this.options = Object.assign(
      DefaultClientOptions,
      options
    ) as Required<ClientOptions>;
    this.options.intents = resolveIntents(this.options.intents!);
    this.#token = token;
    this.http = new RequestManager(
      new RESTClient(
        RESTClient.createRESTOptions(this.options, this.#token, 'Bot')
      ),
      this
    );
  }

  public async connect(): Promise<void> {
    let gatewayInfo: APIGatewayBotInfo;

    if (!process.env.__FUWA_SHARD_ID) {
      gatewayInfo = await this.http
        .queue<APIGatewayBotInfo>(new APIRequest('/gateway/bot'))
        .then((res) => res.data);
    } else {
      gatewayInfo = {
        shards: +process.env.__FUWA_SHARD_COUNT!,
        session_start_limit: {
          remaining: 1,
          reset_after: -1,
          total: Infinity,
          max_concurrency: +process.env.__FUWA_SHARD_CONCURRENCY!,
        },
        url: process.env.__FUWA_GATEWAY_URL!,
      };
    }

    if (gatewayInfo.shards > 1 && !process.env.__FUWA_SHARD_COUNT)
      throw new Error(
        'Discord has recommended to use shards for this user but no shard information was found. Consider using a ShardingManager.'
      );

    const url = this.constructGatewayURL(gatewayInfo.url);
    const shard: [id: number, total: number] = [
      +(process.env.__FUWA_SHARD_ID ?? 0),
      +(gatewayInfo.shards ?? 1),
    ];

    this.debug(
      `
[fuwa] connecting to gateway 
\t url \t:\t ${url}
\t shard \t:\t [${shard.join(', ')}]
`.trim()
    );

    this.ws = new GatewayShard(this, shard, this.#token);

    await this.ws.connect(url);
  }

  private constructGatewayURL(url: string) {
    this.debug(this.options.etf);
    return `${url}?v=${this.options.apiVersion}&encoding=${
      this.options.etf ? 'etf' : 'json'
    }`;
  }

  public debug(...data: any[]) {
    this.emit('debug', ...data);
  }
}

export interface Client extends EventEmitter {
  on<T extends keyof ClientEvents>(event: T, ...data: ClientEvents[T]): this;
  on<T extends Exclude<string, keyof ClientEvents>>(
    event: T,
    data: any[]
  ): this;
  once<T extends keyof ClientEvents>(event: T, ...data: ClientEvents[T]): this;
  once<T extends Exclude<string, keyof ClientEvents>>(
    event: T,
    data: any[]
  ): this;
  addEventListener<T extends keyof ClientEvents>(
    event: T,
    ...data: ClientEvents[T]
  ): this;
  addEventListener<T extends Exclude<string, keyof ClientEvents>>(
    event: T,
    data: any[]
  ): this;
}

export interface ClientEvents {
  debug: any[];
}
