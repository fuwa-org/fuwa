import { Bitfield } from "../util/Bitfield";
export declare class Intents extends Bitfield {
    static FLAGS: {
        GUILDS: number;
        GUILD_MEMBERS: number;
        GUILD_BANS: number;
        GUILD_EMOJIS: number;
        GUILD_INTEGRATIONS: number;
        GUILD_WEBHOOKS: number;
        GUILD_INVITES: number;
        GUILD_VOICE_STATES: number;
        GUILD_PRESENCES: number;
        GUILD_MESSAGES: number;
        GUILD_MESSAGE_REACTIONS: number;
        GUILD_MESSAGE_TYPING: number;
        DIRECT_MESSAGES: number;
        DIRECT_MESSAGE_REACTIONS: number;
        DIRECT_MESSAGE_TYPING: number;
        GUILD_MESSAGE_CONTENT: number;
    };
    static get ALL(): number;
    static get UNPRIVILEGED(): number;
    static PRIVILEGED: number;
    static DEFAULT: number[];
}
