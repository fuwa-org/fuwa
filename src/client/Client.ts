import { RequestManager } from '../rest/RequestManager.js';
import { RESTClient } from '../rest/RESTClient';
import {
  ClientOptions,
  DefaultClientOptions,
  resolveIntents,
  Snowflake,
} from './ClientOptions';
import EventEmitter from 'events';
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
import { redactToken } from '../util/tokens.js';
import { GatewayManager } from '../ws/GatewayManager.js';
import { workerData } from 'worker_threads';

export class Client extends EventEmitter {
  #token: string;
  public http: RequestManager;
  public options: Required<ClientOptions>;

  public logger: ILogger;

  public ws: GatewayManager;

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
    this.ws = new GatewayManager(this);

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
    this.logger.info('connecting to gateway...');

    if (
      process.env.__FUWA_SHARDING_MANAGER ||
      workerData?.__fuwa_sharding_manager
    ) {
      const options = {
        token: this.#token,
        url: this.constructGatewayURL('wss://gateway.discord.gg'),
      };

      if (process.env.__FUWA_SHARDING_MANAGER) {
        this.ws.spawnWithShardingManager({
          ...options,
          mode: 'env',
        });
      } else if (workerData.__fuwa_sharding_manager) {
        this.ws.spawnWithShardingManager({
          ...options,
          mode: 'worker',
          workerData: workerData,
        });
      }
    }

    await this.ws.spawn({
      token: this.#token,
      url: this.constructGatewayURL('wss://gateway.discord.gg'),
      shards: 'auto',
    });
  }

  public token(redact = true) {
    if (redact) return redactToken(this.#token);
    return this.#token;
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
    this.emit(event.replace(/^meta\./, ''), ...data);
  }

  public event(name: string) {
    return new Events.SubscriptionBuilder(name, this);
  }

  public reset() {
    this.ws?.reset();
    this.http.buckets.clear();
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
  on<K extends Exclude<string, keyof ClientEvents>>(
    event: K,
    listener: (...args: any[]) => void
  ): this;
}

export interface ClientEvents {
  ready: [];
  resumed: [session_id: string];
  'guilds.create': [Guild];
  'guilds.delete': [id: Snowflake];
  'guilds.update': [old: Guild, new: Guild];
  'messages.create': [Message];
  'messages.delete': [
    { guild: Guild | null; channel: TextChannel; id: Snowflake }
  ];
  'messages.update': [old: Message, new: Message];
}

export type Awaitable<T> = Promise<T> | T;
