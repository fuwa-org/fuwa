import { RequestManager } from '../rest/RequestManager.js';
import { RESTClient } from '../rest/RESTClient';
import {
  ClientOptions,
  DefaultClientOptions,
  resolveIntents,
  Snowflake,
} from './ClientOptions';
import { APIGatewayBotInfo, Routes } from '@splatterxl/discord-api-types';
import EventEmitter from 'events';
import { GatewayShard } from '../ws/GatewayShard.js';
import { GuildManager } from '../structures/managers/GuildManager.js';
import { ILogger } from '../logging/ILogger.js';
import { DisabledLogger } from '../logging/DisabledLogger.js';
import { DefaultLogger } from '../logging/DefaultLogger.js';
import {
  DefaultLoggerOptions,
  LoggerOptions,
} from '../logging/LoggerOptions.js';
import { UserManager } from '../structures/managers/UserManager.js';
import { ExtendedUser } from '../structures/ExtendedUser.js';
import { ChannelManager } from '../structures/managers/ChannelManager.js';
import Events from '@fuwa/events';
import { Message } from '../structures/Message.js';
import { Guild } from '../structures/Guild.js';
import { TextChannel } from '../structures/templates/BaseTextChannel.js';

export class Client extends EventEmitter {
  #token: string;
  public http: RequestManager;
  public options: Required<ClientOptions>;

  public logger: ILogger;

  public ws?: GatewayShard;

  public guilds: GuildManager;
  public users: UserManager;
  public channels: ChannelManager;

  public user: ExtendedUser | null = null;

  private timeouts: Array<NodeJS.Timeout> = [];
  private timers: Array<NodeJS.Timeout> = [];

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

    if (!this.options.logger) {
      this.logger = new DisabledLogger();
    } else if (typeof this.options.logger === 'boolean') {
      this.logger = new DefaultLogger(DefaultLoggerOptions);
    } else if (!('warn' in this.options.logger)) {
      this.logger = new DefaultLogger(this.options.logger as LoggerOptions);
    } else {
      this.logger = this.options.logger;
    }

    this.guilds = new GuildManager(this);
    this.users = new UserManager(this);
    this.channels = new ChannelManager(this);
  }

  public async connect(): Promise<void> {
    let gatewayInfo: APIGatewayBotInfo;

    if (!process.env.__FUWA_SHARD_ID) {
      gatewayInfo = await this.http
        .queue({
          route: Routes.gatewayBot(),
        })
        .then((res) => res.body.json());
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
[${this.logger.kleur().blue('WS')} => ${this.logger
        .kleur()
        .green('Manager')}] connecting to gateway 
\t url \t:\t ${url}
\t shard \t:\t [${shard.join(', ')}]
`.trim()
    );

    this.ws = new GatewayShard(this, shard, this.#token);

    await this.ws.connect(url);
  }

  private constructGatewayURL(url: string) {
    return `${url}?v=${this.options.apiVersion}&encoding=${
      this.options.etf ? 'etf' : 'json'
    }`;
  }

  public debug(...data: any[]) {
    this.logger.debug(...data);
  }

  public delegate(event: `${string}.${string}`, ...data: any[]) {
    this.emit(event.replace(/^meta\./, ""), ...data);
  }

  public event(name: string) {
    return new Events.SubscriptionBuilder(name, this);
  }

  public reset() {
    this.ws?.close(false);
    this.ws?.reset(true);
    this.http.queues.clear();
    this.timeouts.forEach((t) => clearTimeout(t));
    this.timers.forEach((t) => clearInterval(t));
    this.logger.info('reset client: done');
  }
}

export interface Client {
  on<K extends keyof ClientEvents>(
    event: K,
    listener: (...args: ClientEvents[K]) => void
  ): this;
  on<K extends Exclude<string, keyof ClientEvents>>(event: K, listener: (...args: any[]) => void): this;
}

export interface ClientEvents {
  ready: [],
  resumed: [session_id: string],
  "guilds.create": [Guild],
  "guilds.delete": [id: Snowflake],
  "guilds.update": [old: Guild, new: Guild],
  "messages.create": [Message],
  "messages.delete": [{ guild: Guild | null, channel: TextChannel, id: Snowflake }],
  "messages.update": [old: Message, new: Message],
}

export type Awaitable<T> = Promise<T> | T;
