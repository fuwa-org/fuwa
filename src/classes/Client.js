const Intents = require("../util/Intents");                                                                 const Guild = require("./Guild");
const User = require("./User"),                                                                               Message = require("./Message"),
  { EventEmitter } = require("events"),
  WebSocketManager = require("../managers/WebSocketManager"),
  Collection = require("@discordjs/collection"),
  request = require("../rest/RequestHandler");

class Client extends EventEmitter {
  /**
   * @private
   */
  _tokenOnLogin;
  /**
   *
   * @type {number}
   */
  intents;
  /**
   * @param {ClientOptions} options The options for this instance of the Client.
   */
  constructor(options = {}) {
    super();
    Object.assign({ token: process.env.DISCORD_TOKEN }, options);
    if (!options.intents)                                                                                         throw new ReferenceError("Client must specify intents.");
    /**
     * @type {OptionsIntents} intents
     */
    let intents = options.intents;
    if (Array.isArray(intents))
      intents = intents
        .map((v) => (typeof v === "number" ? v : Intents.FLAGS[v]))
        .reduce((a, b) => (b ? a + b : a));
    this.intents = typeof intents === "number" ? intents : 0;                                                   if (options.token)
      Object.defineProperty(this, "token", {
        value: options.token?.replace(/^B(ot|earer) /, ""),
      });
    else this._tokenOnLogin = true;
  }
  /**
   *
   * @param {`Bot ${string}` | `Bearer ${string}` | string} token
   */
  async login(token) {
    if (this._tokenOnLogin && !token) throw new Error("Must specify a token. ");
    Object.defineProperty(this, "token", {
      value: this.token ?? token?.replace(/^B(ot|earer) /, ""),
    });

    this.__addWsListeners();
    this.user = await this.ws.connect(this.token || token);
  }
  ws = new WebSocketManager(this);
  /**
   * @private
   */
  __addWsListeners() {
    setTimeout(
      () =>
        this.ws.socket.on("message", (data) => {
          data = JSON.parse(data);
          switch (data.t) {
            case "MESSAGE_CREATE":
              this.emit("message", new Message(data.d, this));
              console.log("Emitted MESSAGE_CREATE [as MESSAGE].");
              this.users.get(data.d.author.id) ??
                this.users.set(data.d.author.id, new User(data.d.author));
              break;
            case "READY":
              this.emit("gatewayReady", this);
              this.user = data.d.user;
              this.startGuildCount = data.d.guilds.length;
              this.guildCount = 0;
              console.log("Emitted GATEWAY_READY event.");
              break;
            case "GUILD_CREATE":
              this.emit("cacheRequest", {type: "guild",
                data: new Guild(data.d, this),
              });
              this.guildCount++;
              if (this.guildCount === this.startGuildCount) {
                this.emit("ready", this);
                console.log("Client recieved all its guilds.");
                delete this.startGuildCount;
              }
          }
        }),
      1
    );
    this.on("cacheRequest", (opts) =>
      this[`${opts.type}s`].set(opts.data.id, opts.data)
    );
  }
  /**                                                                                                          * @private
   */
  __removeWsListeners() {
    setTimeout(
      () =>
        this.ws.socket.off("message", (data) => {
          data = JSON.parse(data);
          switch (data.t) {
            case "MESSAGE_CREATE":
              this.emit("message", new Message(data.d, this));                                                            console.log("Emitted MESSAGE_CREATE [as MESSAGE].");
              this.users.get(data.d.author.id) ??
                this.users.set(data.d.author.id, new User(data.d.author));
              break;
            case "READY":
              this.emit("gatewayReady", this);
              this.user = data.d.user;
              this.startGuildCount = data.d.guilds.length;
              this.guildCount = 0;
              console.log("Emitted GATEWAY_READY event.");
              break;
            case "GUILD_CREATE":
              this.emit("cacheRequest", {
                type: "guild",
                data: new Guild(data.d, this),
              });
              this.guildCount++;
              if (this.guildCount === this.startGuildCount) {
                this.emit("ready", this);
                console.log("Client recieved all its guilds");
                delete this.startGuildCount;
              }
          }
        }),
      1
    );
    this.off("cacheRequest", (opts) =>
      this[`${opts.type}s`].set(opts.data.id, opts.data)
    );
  }
  // @ts-ignore
  channels = new Collection();
  // @ts-ignore
  guilds = new Collection();
  // @ts-ignore
  users = new Collection();
  /**
   * @event ready The Client is ready and all guilds have been cached.
   */
}

module.exports = Client;
/**                                                                                                          * @typedef {number | (string | number)[]} OptionsIntents
 */

/**
 * @typedef {{token?: string, intents: number | (string | number)[]}} ClientOptions
 */
