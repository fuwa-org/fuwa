import { EventEmitter } from "events";
import { ERRORS } from "./constants";
import { RequestOptions, RESTManager } from "./rest";
import { WebSocketManager } from "./ws";
export interface ClientOptions {
  intents: number;
}

export interface Client {
  token: string;
}
export class Client extends EventEmitter {
  options: ClientOptions;
  rest = new RESTManager(this);
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
  private _request(arg0: string, arg1: RequestOptions) {
    return this.rest.request(arg0, arg1);
  }
  get request(): RESTManager["request"] {
    return this._request;
  }
  private _connect() {
    return this.ws.connect();
  }
  get connect(): WebSocketManager["connect"] {
    return this._connect;
  }
  intervals: NodeJS.Timeout[] = [];
  token: string;
}
