import { EventEmitter } from 'events';
import { ERRORS } from './constants';
import { RequestOptions, RESTManager } from './rest';
import { User } from './structures/User';
import { WebSocketManager } from './ws';
import Collection from '@discordjs/collection';
import { Snowflake } from './util/snowflake';
import { APIGuild, APIUnavailableGuild } from 'discord-api-types';
export interface ClientOptions {
  intents: number;
}
export interface ClientEvents {
  ready: [];
  debug: [string];
}
export interface Client {
  token: string;
}
/** The main class of this wrapper and where all communication with Discord is based from.
 * <warning>Sharded clients are not supported by Wrappercord</warning>
 */
export class Client extends EventEmitter {
  /** Cached guilds the bot is in
   * <info>Every guild is cached by default in un-sharded clients</info>
   */
  guilds = new Collection<
    Snowflake,
    APIGuild | APIUnavailableGuild | (APIUnavailableGuild & { uncached: true })
  >();
  /** Intervals that can be cleared with `Client#destroy()`
   * @see Client#destroy
   */
  intervals: NodeJS.Timeout[] = [];
  /** Options passed to the constructor.
   * @see Client
   */
  options: ClientOptions;
  /** The main HTTP request manager */
  rest = new RESTManager(this);
  /** Timeouts that can be cleared with `Client#destroy()`
   * @see Client#destroy
   */
  timeouts: NodeJS.Timeout[] = [];
  /** The client's User, returned by the READY dispatch */
  user: User = null as unknown as User;
  /** The WebSocket connection manager */
  ws: WebSocketManager;
  /**
   * @param token The Client's Bot token. **User tokens are not supported.**
   * @param options The options for this instance.
   */
  constructor(token: string, options: ClientOptions) {
    super();
    if (!token) throw ERRORS.NO_TOKEN;
    if (!options || !options.intents) throw ERRORS.NO_INTENTS;
    Object.defineProperty(this, 'token', {
      value: token,
      enumerable: false,
      writable: false,
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
  /** Make a request to the API. Rate-limits are cached and managed by this function. */
  get request(): RESTManager['request'] {
    return this._request;
  }
  declare on: <K extends keyof ClientEvents>(
    event: K,
    handler: (...args: ClientEvents[K]) => void
  ) => this;
}
