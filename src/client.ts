import { EventEmitter } from "events";
import { ERRORS } from "./constants";
import { RESTManager } from "./rest";
import { WebSocketManager } from "./ws";
export interface ClientOptions {
  intents: number;
}

export interface Client {
  token: string;
}
export class Client extends EventEmitter {
  options: ClientOptions;
  rest: RESTManager;
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
  get request(): RESTManager["request"] {
    return this.rest.request;
  }
  get connect(): WebSocketManager["connect"] {
    return this.ws.connect;
  }
  token: string;
}
