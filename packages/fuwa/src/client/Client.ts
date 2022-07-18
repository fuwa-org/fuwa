import {
  APIRequest,
  consumeJSON,
  Response,
  REST,
  RESTClient,
} from '@fuwa/rest';
import { GatewayManager, GatewayShard } from '@fuwa/ws';
import { Snowflake } from 'discord-api-types/globals';
import EventEmitter from 'events';
import { HttpMethod } from 'undici/types/dispatcher';
import { workerData } from 'worker_threads';
import { DefaultLogger } from '../logging/DefaultLogger.js';
import { DisabledLogger } from '../logging/DisabledLogger.js';
import { ILogger } from '../logging/ILogger.js';
import {
  DefaultLoggerOptions,
  LoggerOptions,
} from '../logging/LoggerOptions.js';
import { Channels } from '../structures/Channel.js';
import { DMChannel } from '../structures/DMChannel.js';
import { ExtendedUser } from '../structures/ExtendedUser.js';
import { Guild } from '../structures/Guild.js';
import { GuildMember } from '../structures/GuildMember.js';
import { ChannelManager } from '../structures/managers/ChannelManager.js';
import { GuildManager } from '../structures/managers/GuildManager.js';
import { UserManager } from '../structures/managers/UserManager.js';
import { Message } from '../structures/Message.js';
import { Intents } from '../util/bitfields/Intents.js';
import { FuwaError } from '../util/errors.js';
import { redactToken } from '../util/tokens.js';
import { handleDispatch } from '../ws/DispatchHandler.js';
import {
  ClientOptions,
  DefaultClientOptions,
  resolveIntents,
} from './ClientOptions';

/**
 * The client class represents a [bot application](https://discordapp.com/developers/docs/topics/oauth2)'s
 * link to the Discord API. This is where it can send HTTP requests to the REST API and receive
 * payloads from the WebSocket gateway. [Learn more](https://discordapp.com/developers/docs/intro).
 *
 * In addition to providing low-level functionality, available through the {@link Client.rest} getter
 * and {@link Client.ws} gateway manager, this class also provides a number of utility mappings to
 * simplify the process of interacting with the REST and WebSocket APIs.
 *
 * For example, if you wish to listen to a raw gateway event, you can do so by doing the following:
 * ```js
 * client.ws.on('MESSAGE_CREATE', (packet) => {
 *   // do something with the packet
 * });
 * ```
 * See {@link GatewayManager} for details.
 *
 * However, if you wish to use the utility mappings that simplify the process of interacting with
 * the payload, you may do so by doing the following:
 * ```js
 * client.on('messageCreate', (message) => {
 *   // do something with the message
 * });
 * ```
 *
 * You may notice in this example that the event names differ from the ones used in the WebSocket
 * gateway. This is because the mappings attempt to, in a way, JavaScript-ify the payloads. This means
 * that the event names are converted to camelCase, and the payloads are converted to objects with camelCase
 * properties.
 *
 * For more information on the utility mappings, see [the guide] (todo).
 *
 * The HTTP requests sent by this class are authenticated using the bot token provided in the
 * constructor's `token` parameter. Usually, you will not interact directly with the HTTP requests,
 * but rather use the utility mappings provided by classes, like {@link Client.createDM} or
 * {@link TextChannel.createMessage}. However, if you do wish to send a request directly, you may interface
 * with the {@link Client.rest} getter or {@link RequestManager.queue} through {@link Client.http}.
 *
 * For example, if you wished to send a request to the REST API to create a new channel, you would do:
 * ```js
 * await client.http
 *   .queue({
 *     route: Routes.guildChannels(guildId),
 *     method: 'POST',
 *     body: {
 *       // etc.
 *     }
 *   });
 *
 * // or...
 * await client.rest(Routes.guildChannels(guildId))
 *   .post({
 *     body: {
 *       // etc.
 *     }
 *   });
 * ```
 *
 * All requests made through those methods follow the [rate limits](https://discord.com/developers/docs/topics/rate-limits)
 * set by Discord, and are automatically retried if they fail due to said rate limits. If a bad request (HTTP status 400)
 * occurs, the error is pretty printed and thrown.
 */
export class Client extends EventEmitter {
  #token: string;

  /**
   * Options used to initialize the Client, resolved
   * so that all properties are present.
   */
  public options: Required<ClientOptions>;

  /**
   * Logging class used by the Client, configured with {@link ClientOptions.logger}.
   */
  public logger: ILogger;

  /**
   * The GatewayManager represents a cluster of shards managed by this client.
   * Used in conjunction with {@link ShardingManager}, this class can be very
   * powerful for handling large amounts of guilds.
   */
  public ws: GatewayManager;
  /**
   * The request manager used internally by the Client.
   */
  public http: REST;

  /**
   * A collection of all the guilds available to this client. This may not always represent
   * _every_ guild this client can see, as it is limited by the amount of shards the client
   * is running on. Getting an accurate list of guilds is planned for release `v0.2.0`.
   */
  public guilds: GuildManager;
  /**
   * A collection of users cached by the client.
   */
  public users: UserManager;
  /**
   * A collection of all the channels available to this client. Is exactly equivalent
   * to every channel in every guild this client can see.
   * @see {@link Client.guilds}
   */
  public channels: ChannelManager;

  /**
   * The client's public-facing user. Extended with additional information. Null if thr
   * client is not logged in.
   */
  public user: ExtendedUser | null = null;

  private timeouts: Array<NodeJS.Timeout> = [];
  private timers: Array<NodeJS.Timeout> = [];

  public constructor(token?: string, options?: ClientOptions);
  public constructor(options?: ClientOptions);
  public constructor(token?: string | ClientOptions, options?: ClientOptions) {
    super();

    this.options = Object.assign(
      {},
      DefaultClientOptions,
      typeof token === 'object' ? token : { token, ...options },
    ) as Required<ClientOptions>;
    this.#token = this.options.token ?? process.env.DISCORD_TOKEN ?? '';
    this.options.intents = resolveIntents(this.options.intents!);
    options = this.options;
    delete options.token;
    this.options = options as Required<ClientOptions>;

    if (!this.options.logger) {
      this.logger = new DisabledLogger();
    } else if (typeof this.options.logger === 'boolean') {
      this.logger = new DefaultLogger(DefaultLoggerOptions);
    } else if (!('warn' in this.options.logger)) {
      this.logger = new DefaultLogger(this.options.logger as LoggerOptions);
    } else {
      this.logger = this.options.logger;
    }

    this.http = new REST(
      'Bot ' + this.#token,
      RESTClient.createRESTOptions(this.options, this.#token, 'Bot'),
      {
        timings: this.options.httpTimings,
        logger: this.logger,
      },
    );
    this.ws = new GatewayManager(
      this.http,
      {
        intents: (this.options.intents! as Intents).bits,
        apiVersion: this.options.apiVersion,
      },
      this.#token,
    );

    this.guilds = new GuildManager(this);
    this.users = new UserManager(this);
    this.channels = new ChannelManager(this);
  }

  /**
   * Connect to the gateway and begin listening for events. You can still use the REST/HTTP
   * methods to send requests to the REST API without invoking this method.
   *
   * If the client is already connected, this method disconnects all shards and reconnects.
   */
  public async connect(): Promise<void> {
    this.logger.info('connecting to gateway...');

    const token = this.#token;

    if (!token || typeof token !== 'string' || token.trim() == '')
      throw new FuwaError('INVALID_TOKEN');

    if (
      process.env.__FUWA_SHARDING_MANAGER ||
      workerData?.__fuwa_sharding_manager
    ) {
      const options = {
        token,
      };

      if (process.env.__FUWA_SHARDING_MANAGER) {
        await this.ws.spawnWithShardingManager({
          ...options,
          mode: 'env',
        });
      } else if (workerData.__fuwa_sharding_manager) {
        await this.ws.spawnWithShardingManager({
          ...options,
          mode: 'worker',
          workerData,
        });
      }

      this.ws.on('dispatch', (data, shard) =>
        handleDispatch(this, this.ws, data, shard),
      );
      this.ws.on('clientEvent', (name, ...data) => this.emit(name, ...data));

      return;
    }

    this.ws.on('dispatch', (data, shard) =>
      handleDispatch(this, this.ws, data, shard),
    );
    this.ws.on('clientEvent', (name, ...data) => this.emit(name, ...data));

    await this.ws.spawn({
      shards: 'auto',
    });
  }

  /**
   * Return the client's token.
   * @param redact Whether to replace the last component of the token with '*'
   */
  public token(redact = true) {
    if (redact) return redactToken(this.#token);
    return this.#token;
  }

  public debug(...data: any[]) {
    this.logger.debug(...data);
  }

  /**
   * @private
   * @internal
   * @ignore
   */
  public delegate(event: `${string}.${string}`, ...data: any[]) {
    this.emit(event.replace(/^meta\./, ''), ...data);
  }

  /**
   * Perform a full cache reset of the client. Disconnects all shards, clears bucket rate limits,
   * and clears all caches.
   */
  public reset() {
    this.ws?.reset();
    this.http.buckets.clear();
    this.timeouts.forEach(t => clearTimeout(t));
    this.timers.forEach(t => clearInterval(t));
    this.guilds.cache.clear();
    this.users.cache.clear();
    this.channels.cache.clear();
    this.logger.info('reset client: done');
  }

  /**
   * Simplifies the process of sending a request to the REST API. The underlying logic still
   * uses {@link Client.http} internally, but this method simplifies the process of sending
   * requests to the REST API.
   *
   * @example ```js
   * await client.rest
   *   .applications(client.user.id)
   *   .commands.get();
   *
   * await client.rest(Routes.channel("123456789"))
   *   .messages.get();
   * ```
   *
   * @see {@link APIProxy}
   */
  public get rest(): APIProxy {
    let route: string[] = [''];

    const handler: ProxyHandler<typeof addRoute> = {
      get: function (this: Client, _: any, prop: string) {
        switch (prop) {
          case 'route':
            return route.join('/');
          case 'get':
          case 'post':
          case 'put':
          case 'patch':
          case 'delete':
            return (options: APIRequestOptions, json = true) => {
              return this.http
                .queue<any>({
                  route: route.join('/'),
                  method: prop.toUpperCase() as HttpMethod,
                  ...options,
                })
                .then((d: any) => (json ? consumeJSON(d) : d)) as any;
            };
          default: {
            if (typeof prop === 'symbol') return () => route.join('/');
            route.push(prop);
            return new Proxy(addRoute, handler);
          }
        }
      }.bind(this),
    };

    function addRoute(...fragments: string[]) {
      if (route.length > 1) route.push(...fragments);
      else route = fragments;
      return new Proxy(addRoute, handler);
    }

    return new Proxy(addRoute, handler) as APIProxy;
  }

  /**
   * Create a {@link DMChannel} with the given user. Creating too many of these within a short
   * period of time may result in your application being quarantined.
   *
   * @param recipient Recipient to create a DM with. Accepts only a user ID.
   * @param cache Whether to cache the resulting DM channel.
   */
  public createDM(recipient: Snowflake, cache = false): Promise<DMChannel> {
    return this.channels.createDM(recipient, cache);
  }
}

export interface Client {
  on<K extends keyof ClientEvents>(
    event: K,
    listener: (...args: ClientEvents[K]) => void,
  ): this;
  on<K extends Exclude<string, keyof ClientEvents>>(
    event: K,
    listener: (...args: any[]) => void,
  ): this;
}

export interface ClientEvents {
  ready: [];
  shardResume: [shard: GatewayShard];
  shardReady: [shard: GatewayShard];
  shardReconnect: [shard: GatewayShard];
  shardRespawn: [id: number];
  guildCreate: [Guild];
  guildDelete: [id: Snowflake];
  guildUpdate: [old: Guild, new: Guild];
  channelCreate: [Channels];
  channelDelete: [{ id: Snowflake; guild: Snowflake | null }];
  channelUpdate: [old: Channels, new: Channels];
  guildMemberAdd: [GuildMember];
  guildMemberRemove: [{ guild: Snowflake; id: Snowflake }];
  guildMemberUpdate: [old: GuildMember, new: GuildMember];
  guildMembersChunk: [guild: Guild, members: Snowflake[]];
  messageCreate: [Message];
  messageDelete: [
    { guild: Snowflake | null; channel: Snowflake; id: Snowflake },
  ];
  messageUpdate: [old: Message, new: Message];
}

export type APIRequestOptions<D = any> = Omit<APIRequest<D>, 'route'>;

export type APIProxy = {
  [key: string]: APIProxy;
} & {
  get: APIProxyExecuteRequest<true>;
  post: APIProxyExecuteRequest;
  put: APIProxyExecuteRequest;
  patch: APIProxyExecuteRequest;
  delete: APIProxyExecuteRequest<true>;
} & ((...args: any[]) => APIProxy);

type APIProxyExecuteRequest<O = false> = <T, D = any, Json = true>(
  options?: O extends true
    ? Omit<APIRequestOptions<D>, 'body' | 'files'>
    : APIRequestOptions<D>,
  json?: Json,
) => Promise<Json extends true ? T : Response<T>>;
