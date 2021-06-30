import { Snowflake } from 'discord-api-types';
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
    message(channelid: Snowflake, id: Snowflake): string {
      return `${this.channelMessages(channelid)}/${id}`;
    },
    channelMessages(channelid: Snowflake): string {
      return `${this.base}/channels/${channelid}/messages`;
    },
  },
  api: {
    version: 'v9',
    userAgent: `DiscordBot (https://github.com/nearlySplat/fuwa, ${version}) Fuwa/${version} Node.js/${process.version}`,
    gatewayProperties: {
      $os: process.platform,
      $browser: 'fuwa',
      $device: 'fuwa',
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
  SHARDING: new TypeError('Sharding is not supported by Fuwa.'),
  IDENTIFY_LIMIT: new RangeError(
    'Your client has exceeded the 1000 daily log-in limit.'
  ),
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

export const COLORS = {
  DEFAULT: 0x000000,
  WHITE: 0xffffff,
  AQUA: 0x1abc9c,
  GREEN: 0x57f287,
  BLUE: 0x3498db,
  YELLOW: 0xfee75c,
  PURPLE: 0x9b59b6,
  LUMINOUS_VIVID_PINK: 0xe91e63,
  FUCHSIA: 0xeb459e,
  GOLD: 0xf1c40f,
  ORANGE: 0xe67e22,
  RED: 0xed4245,
  GREY: 0x95a5a6,
  NAVY: 0x34495e,
  DARK_AQUA: 0x11806a,
  DARK_GREEN: 0x1f8b4c,
  DARK_BLUE: 0x206694,
  DARK_PURPLE: 0x71368a,
  DARK_VIVID_PINK: 0xad1457,
  DARK_GOLD: 0xc27c0e,
  DARK_ORANGE: 0xa84300,
  DARK_RED: 0x992d22,
  DARK_GREY: 0x979c9f,
  DARKER_GREY: 0x7f8c8d,
  LIGHT_GREY: 0xbcc0c0,
  DARK_NAVY: 0x2c3e50,
  BLURPLE: 0x5865f2,
  GREYPLE: 0x99aab5,
  DARK_BUT_NOT_BLACK: 0x2c2f33,
  NOT_QUITE_BLACK: 0x23272a,
} as const;
