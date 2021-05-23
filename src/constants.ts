import fs from 'fs';
import path from 'path';
import { ImageFormat, ImageSize } from './types';
const { version } = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')
);
export const CONSTANTS = {
  urls: {
    base: 'https://discord.com/api/v9',
    getGatewayBot: '/gateway/bot',
    socketUrl: `wss://gateway.discord.gg/?v=9&encoding=json`,
    cdn: {
      base: 'https://cdn.discordapp.com',
      avatar(hash: string, format: ImageFormat, size: ImageSize): string {
        return `${this.base}/avatars/${hash}.${format}${
          size ? `?size=${size}` : ''
        }`;
      },
      defaultAvatar(disc: number): string {
        return `${this.base}/embed/avatars/${disc % 5}.png`;
      },
    },
  },
  api: {
    version: 'v9',
    userAgent: `DiscordBot (https://github.com/nearlysplat/wrappercord, ${version}) Wrappercord/${version} Node.js/${process.version}`,
    gatewayProperties: {
      $os: process.platform,
      $browser: 'wrappercord',
      $device: 'wrappercord',
    },
    headers: {
      get 'User-Agent'(): string {
        return CONSTANTS.api.userAgent;
      },
    },
  },
  getUrl(str: string): string {
    if (str in this.urls === false) return this.urls.base;
    return this.urls.base + this.urls[str as keyof typeof CONSTANTS.urls];
  },
};

export const ERRORS = {
  NO_TOKEN: new TypeError('An invalid token was provided for the client.'),
  NO_INTENTS: new TypeError('No intents were provided for the Client.'),
  SHARDING: new TypeError('Sharding is not supported by wrappercord.'),
};

export type HTTPMethod =
  | 'GET'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'CONNECT'
  | 'OPTIONS'
  | 'TRACE'
  | 'get'
  | 'head'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete'
  | 'connect'
  | 'options'
  | 'trace';
