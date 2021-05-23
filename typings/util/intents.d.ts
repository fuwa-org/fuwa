import { BitField } from './BitField';
export declare class Intents extends BitField {
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
    };
    /**
     * Every Gateway Intent.
     */
    static ALL: any;
    /**
     * Non-priveledged [Gateway Intents](https://discord.com/developers/docs/topics/gateway#gateway-intents).
     */
    static NON_PRIVILEDGED: number;
    /**
     * Priveledged Gateway Intents.
     */
    static PRIVILEDGED: number;
}
