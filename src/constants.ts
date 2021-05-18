import fs from "fs";
import path from "path";
const { version } = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8")
);
export const CONSTANTS = {
  urls: {
    base: "https://discord.com/api/v9",
    getGatewayBot: "/gateway/bot",
    socketUrl: `wss://gateway.discord.gg/?v=9&encoding=json`,
  },
  api: {
    version: "v9",
    userAgent: `DiscordBot (https://github.com/nearlysplat/wrappercord, ${version}) Wrappercord/${version} Node.js/${process.version}`,
    gatewayProperties: {
      $os: "linux",
      $browser: "wrappercord",
      $device: "wrappercord",
    },
    headers: {
      get "User-Agent"() {
        return CONSTANTS.api.userAgent;
      },
    },
  },
  getUrl(str: string) {
    if (str in this.urls === false) return this.urls.base;
    return this.urls.base + this.urls[str as keyof typeof CONSTANTS.urls];
  },
};

export const ERRORS = {
  NO_TOKEN: new TypeError("An invalid token was provided for the client."),
  NO_INTENTS: new TypeError("No intents were provided for the Client"),
};
