import Collection from '@discordjs/collection';
import { APIGuild, APIUnavailableGuild } from 'discord-api-types';
import { EventEmitter } from 'events';
import { ERRORS } from './constants';
import { RequestOptions, RESTManager } from './rest';
import { Message } from './structures/Message';
import { User } from './structures/User';
import { Snowflake } from './util/snowflake';
import { WebSocketManager } from './ws';
export interface ClientOptions {
  /** The {@link Intents} for this client */
  intents: number;
}
export interface ClientEvents {
  ready: [];
  debug: [message: string];
  messageCreate: [message: Message];
  guildCreate: [APIGuild];
}
export interface Client {
  token: string;
}
/** The main class of this wrapper and where all communication with Discord is based from.
 *
 * <warning>Sharded Clients are not supported by Fuwa.</warning>
 */
export class Client extends EventEmitter {
  /** Cached guilds the bot is in
   * <info>Every guild is cached by default in un-sharded clients</info>
   */
  guilds = new Collection<
    Snowflake,
    APIGuild | APIUnavailableGuild | (APIUnavailableGuild & { uncached: true })
  >();
  /** Intervals that can be cleared with {@link Client.destroy}
   */
  intervals: NodeJS.Timeout[] = [];
  /** Options passed to the constructor. */
  options: ClientOptions;
  /** The main HTTP request manager */
  rest = new RESTManager(this);
  /** Timeouts that can be cleared with {@link Client.destroy} */
  timeouts: NodeJS.Timeout[] = [];
  /** The client's token. */
  token: string = null as unknown as string;
  /** The client's {@link User}, returned by the READY dispatch */
  user: User | null = null;
  /** {@link User}s the bot has cached. */
  users = new Collection<Snowflake, User>();
  /** The WebSocket connection manager */
  ws: WebSocketManager;
  /**
   * @param token The Client's Bot token. **User tokens are not supported.**
   * @param options The options for this instance.
   */
  constructor(token: string, options: ClientOptions) {
    super();
    if (typeof token !== 'string' || !token) throw ERRORS.NO_TOKEN;
    if (!options || typeof options.intents !== 'number')
      throw ERRORS.NO_INTENTS;
    Object.defineProperty(this, 'token', {
      value: token,
      enumerable: false,
    });
    this.options = options;
    this.ws = new WebSocketManager(this);
  }
  private _connect() {
    return this.ws.connect();
  }
  private _request<T, R>(arg0: string, arg1: RequestOptions) {
    return this.rest.request<T, R>(arg0, arg1);
  }
  /** Connects to the API. */
  get connect(): WebSocketManager['connect'] {
    return this._connect;
  }
  /** Destroys the client, terminates the connection to Discord and nullifies the token. */
  destroy(): void {
    for (const x of this.timeouts) clearTimeout(x);
    for (const x of this.intervals) clearInterval(x);
    this.timeouts = [];
    this.intervals = [];
    this.token = null;
    this.user = null;
    this.ws.destroy();
  }
  /** Make a {@link RESTManager.request} to the API. Rate-limits are cached and managed by this function. */
  get request(): RESTManager['request'] {
    return this._request;
  }
  declare on: <K extends keyof ClientEvents>(
    event: K,
    handler: (...args: ClientEvents[K]) => void
  ) => this;
}
