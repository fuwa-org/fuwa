import { EventEmitter } from "events";
import { ERRORS } from "./constants";
import { RequestOptions, RESTManager } from "./rest";
import { User } from "./structures/User";
import { WebSocketManager } from "./ws";
export interface ClientOptions {
  intents: number;
}

export interface Client {
  token: string;
}
export class Client extends EventEmitter {
  intervals: NodeJS.Timeout[] = [];
options: ClientOptions;
  rest = new RESTManager(this);
  timeouts: NodeJS.Timeout[] = [];
token: string;
user: User = null as unknown as User;
ws: WebSocketManager;
  
  
  

  
  constructor(token: string, options: ClientOptions) {
    super();
    if (!token) throw ERRORS.NO_TOKEN;
    if (!options || !options.intents) throw ERRORS.NO_INTENTS;
    Object.defineProperty(this, "token", {
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
get connect(): WebSocketManager["connect"] {
    return this._connect;
  }
destroy(): void {
    for (const x of this.timeouts) clearTimeout(x);
    for (const x of this.intervals) clearInterval(x);
    this.token = null;

    // this.ws.destroy();
  }
  get request(): RESTManager["request"] {
    return this._request;
  }
  
  

  
}
