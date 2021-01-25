import Collection from "@discordjs/collection";
import EventEmitter from "events";
declare type Token = `Bot ${string}` | `Bearer ${string}` | string;
declare module "wrappercord" {
  export type Snowflake = `${number}`;
  export interface ClientOptions {
    token?: Token;
    intents: number | (keyof IntentFlags | number)[];
  }
  export class Client {
    constructor(options);
    public user: Record<string, unknown>;
    private token: Token;
    public guilds: Collection<Snowflake, Guild>;
    public login(token?: Token): undefined;
    public on(event: "message", handler: (arg0: Message) => void): Client;
    public on(event: "ready", handler: (arg0: Client) => void): Client;
  }

  export class Guild {
    public ownerID: Snowflake;
    public owner?: User;
  }
  export class Channel {
    public send(content: string, options: Message): Message;
    public send(content: string): Message;
    public send(content: MessageOptions): Message;
    public id: Snowflake;
  }
  export type MessageOptions =
    | Embed
    | {
        replyTo?: MessageResolvable;
      };
  export type MessageResolvable = Message | Snowflake;
  export class Message {
    id: Snowflake;
    channel: Channel;
  }
  export class Embed {
    public type: "rich";
    public timestamp?: number;
    public setTimestamp(): Embed;
    public setTimestamp(timestamp: number | Date): Embed;
    public title?: string;
    public setTitle(title: string): Embed;
    public footer?: IconURLAndTextObject;
    public setFooter(
      text: string,
      iconURL?: string,
      proxyIconURL?: string
    ): Embed;
  }
  export interface IconURLAndTextObject {
    icon_url?: string;
    text?: string;
    proxy_icon_url?: string;
  }
  export class BitField<T = number> {
    constructor(bits: T);
    bitfield: T;
    has(bit: T): boolean;
  }
  export class Intents extends BitField<number> {
    has(bit: number | keyof IntentFlags): boolean;
    static FLAGS: IntentFlags;
  }
  export enum IntentFlags {
    GUILDS = 1 << 0,
    GUILD_MEMBERS = 1 << 1,
    GUILD_BANS = 1 << 2,
    GUILD_EMOJIS = 1 << 3,
    GUILD_INTEGRATIONS = 1 << 4,
    GUILD_WEBHOOKS = 1 << 5,
    GUILD_INVITES = 1 << 6,
    GUILD_VOICE_STATES = 1 << 7,
    GUILD_PRESENCES = 1 << 8,
    GUILD_MESSAGES = 1 << 9,
    GUILD_MESSAGE_REACTIONS = 1 << 10,
    GUILD_MESSAGE_TYPING = 1 << 11,
    DIRECT_MESSAGES = 1 << 12,
    DIRECT_MESSAGE_REACTIONS = 1 << 13,
    DIRECT_MESSAGE_TYPING = 1 << 14,
  }
  export class User extends Channel {
    public publicFlags: number;
    public id: Snowflake;
    public tag: string;
    public client: Client;
  }
}
