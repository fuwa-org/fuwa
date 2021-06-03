import { APIEmbed, Snowflake, APIGuildInteraction, APIPartialEmoji } from 'discord-api-types';
import { Message } from './structures/Message.js';
export declare type ImageFormat = 'webp' | 'gif' | 'jpg' | 'jpeg' | 'png';
export declare type ImageSize = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;
export interface ImageURLOptions {
    format: ImageFormat;
    size: ImageSize;
    dynamic: boolean;
}
export { UserPremiumType } from 'discord-api-types';
export interface MessageAllowedMentions {
    parse?: ('user' | 'role' | 'everyone')[];
    users?: Snowflake[];
    roles?: Snowflake[];
    /** @default true */
    repliedUser?: boolean;
}
export declare type MessageContent = string;
export interface MessageOptions {
    content?: MessageContent;
    embed?: APIEmbed;
    allowedMentions?: MessageAllowedMentions;
    replyTo?: MessageReplyTo;
}
export declare type MessageReplyTo = Message | Snowflake | {
    id: Snowflake;
    channel: Snowflake;
    guild?: Snowflake;
    failIfNotExists?: boolean;
};
export declare enum InteractionType {
    Ping = 1,
    ApplicationCommand = 2,
    MessageComponent = 3
}
export declare enum MessageComponentStyle {
    Primary = 1,
    Secondary = 2,
    Success = 3,
    Danger = 4,
    Link = 5
}
export interface APIGuildMessageComponentInteraction extends APIGuildInteraction {
    type: InteractionType.MessageComponent;
    style?: MessageComponentStyle;
    label?: string;
    emoji?: APIPartialEmoji;
    custom_id?: string;
    url?: string;
    disabled?: string;
}
