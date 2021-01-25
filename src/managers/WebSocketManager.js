const WebSocket = require("ws"),
  { EventEmitter } = require("events"),
  User = require("../classes/User");

module.exports = class WebSocketManager extends EventEmitter {
  constructor(client) {
    super();
    this.client = client;
  }
  async connect(token, sess, seq) {
    this.socket = new WebSocket(`wss://gateway.discord.gg/?v=8&encoding=json`);

    this.socket.on("open", () => {
      setTimeout(() => {
        if (!this._readyRecieved) {
          this.socket.terminate();
          if (this.remaining !== 0) {
            console.log(
              `HELLO not recieved within 10000ms of starting. Reconnecting.`
            );
            this.remaining--;
            this.connect(token);
          } else {
            console.log(
              "HELLO not recieved within 10000ms of starting. Ending process."
            );
            process.exit(127);
          }
        }
      }, 10000);
      this.socket.send(
        JSON.stringify({
          op: sess ? 6 : 2,
          d: {
            token: `Bot ${token}`,
            intents: sess ? undefined : this.client.intents,
            properties: sess
              ? undefined
              : {
                  $os: "linux",
                  $browser: "wrappercord",
                  $device: "wrappercord",
                },
            session_id: sess ? sess : undefined,
            seq: sess ? seq : undefined,
          },
        })
      );
      console.log(`Sent ${sess ? "RESUME" : "IDENTIFY"}.`);
    });

    this.socket.on("message", (data) => {
      data = JSON.parse(data);
      this.emit("apiMessage", data);
      this.emit(data.t ?? data.op, data.d);
      this.s = data.s ?? this.s ?? null;

      switch (data.op) {
        case 10:
          console.log(
            `Received HELLO with ${data.d.heartbeat_interval}ms heartbeat interval.`
          );
          setInterval(() => {
            try {
              this.socket.send(JSON.stringify({ op: 1, d: this.s }));
            } catch {}
            console.log("Sent Heartbeat.");
            this.lastHeartbeat = Date.now();
          }, data.d.heartbeat_interval);
          this._readyRecieved = true;
          break;
        case 11:
          console.log(
            `Heartbeat Acknowledged. Latency: ${
              Date.now() - this.lastHeartbeat
            }ms`
          );
          this.ping = Date.now() - this.lastHeartbeat;
          this.lastHeartbeat = 0;
          break;
        case 9:
          console.warn("Invalid session, reconnecting with IDENTIFY");
          setImmediate(() => this.connect(this.client.token));
          break;
      }
      if (data.t == "READY") {
        console.log(`Recieved READY event with session ${this.sess}.`);
        this.sess = data.d.session_id;
        return new User(data.d.user);
      } else if (data.t === "RESUMED") {
        console.log(`Resumed with session ${this.sess}`);
      }
    });
    this.socket.on("close", (code, message) => {
      this.client.emit("websocketClose", code, message);
      console.error(
        new Error(`Socket closed with code ${code}, message ${message}`)
      );
      if ([4006, 1000, 1006].includes(code)) {
        this.connect(this.client.token, this.sess, this.s);
        this.client.__removeWsListeners();
        this.client.__addWsListeners();
        this.client.emit("gatewayReady", this.client);
        this.client.emit("ready", this.client);
      }
    });
  }
  retryLimit = 5;
  remaining = 5;
};
