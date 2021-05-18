import { EventEmitter } from "events";
import { Client } from "./client";
import { CONSTANTS, ERRORS } from "./constants";
export class WebSocketManager extends EventEmitter {
  socket!: WebSocket;
  client: Client;
  constructor(client: Client) {
    super();
    this.client = client;
  }
  async connect() {
    const token = this.client.token;
    if (!token || !token.length) throw ERRORS.NO_TOKEN;
    const prelimInfo = await this.client.request(
      CONSTANTS.getUrl("getGatewayBot")
    );
    if (!prelimInfo.res.ok) throw ERRORS.NO_TOKEN;
    this.socket = new WebSocket(CONSTANTS.urls.socketUrl);
  }
}

