import Collection from '@discordjs/collection';
import { APIEmbed, APIInteractionDataResolvedGuildMember, APIRole, ApplicationCommandOptionType, // as ApplicationCommandInteractionDataOptionType,
Snowflake } from 'discord-api-types';
import { DMChannel } from './structures/DMChannel.js';
import { Message } from './structures/Message.js';
import { TextBasedChannel } from './structures/TextBasedChannel.js';
import { User } from './structures/User.js';
export declare type ImageFormat = 'webp' | 'gif' | 'jpg' | 'jpeg' | 'png';
export declare type ImageSize = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;
export { UserPremiumType } from 'discord-api-types';
export { ApplicationCommandOptionType };
export interface ImageURLOptions {
    format: ImageFormat;
    size: ImageSize;
    dynamic: boolean;
}
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
export declare type InteractionData = ApplicationCommandData | MessageComponentInteractionData;
export declare type ApplicationCommandDataOption = ApplicationCommandDataOptionSubCommand | ApplicationCommandDataOptionSubCommandGroup;
export interface ApplicationCommandData {
    /** The ID of the command */
    id: Snowflake;
    /** The name of the command */
    name: string;
    /** Options passed to the command, if any */
    options?: ApplicationCommandDataOption[];
    /** Resolved mention-like options */
    resolved?: ApplicationCommandDataResolvedOptions;
}
export interface ApplicationCommandDataResolvedOptions {
    users?: Collection<string, User>;
    roles?: Collection<string, APIRole>;
    members?: Collection<string, APIInteractionDataResolvedGuildMember>;
    channels?: Record<string, Channel>;
}
export interface ApplicationCommandDataOptionSubCommand {
    name: string;
    type: 'subcommand';
    options: ApplicationCommandInteractionDataOptionWithValues[];
}
export interface ApplicationCommandDataOptionSubCommandGroup {
    name: string;
    type: 'subcommandGroup';
    options: ApplicationCommandDataOptionSubCommand[];
}
/** @internal */
export interface InteractionDataOptionBase<T extends ApplicationCommandOptionType, D = unknown> {
    name: string;
    type: T;
    value: D;
}
export declare type ApplicationCommandInteractionDataOptionWithValues = ApplicationCommandInteractionDataOptionString | ApplicationCommandInteractionDataOptionRole | ApplicationCommandInteractionDataOptionChannel | ApplicationCommandInteractionDataOptionUser | ApplicationCommandInteractionDataOptionMentionable | ApplicationCommandInteractionDataOptionInteger | ApplicationCommandInteractionDataOptionBoolean;
export declare type ApplicationCommandInteractionDataOptionString = InteractionDataOptionBase<ApplicationCommandOptionType.String, string>;
export declare type ApplicationCommandInteractionDataOptionRole = InteractionDataOptionBase<ApplicationCommandOptionType.Role, Snowflake>;
export declare type ApplicationCommandInteractionDataOptionChannel = InteractionDataOptionBase<ApplicationCommandOptionType.Channel, Snowflake>;
export declare type ApplicationCommandInteractionDataOptionUser = InteractionDataOptionBase<ApplicationCommandOptionType.User, Snowflake>;
export declare type ApplicationCommandInteractionDataOptionMentionable = InteractionDataOptionBase<ApplicationCommandOptionType.Mentionable, Snowflake>;
export declare type ApplicationCommandInteractionDataOptionInteger = InteractionDataOptionBase<ApplicationCommandOptionType.Integer, number>;
export declare type ApplicationCommandInteractionDataOptionBoolean = InteractionDataOptionBase<ApplicationCommandOptionType.Boolean, boolean>;
export declare type MessageComponentInteractionData = MessageButtonInteractionData | MessageSelectMenuInteractionData;
export interface MessageButtonInteractionData {
    customID: string;
    componentType: 'button';
}
export interface MessageSelectMenuInteractionData {
    customID: string;
    componentType: 'selectMenu';
    values: string[];
}
export declare type Channel = DMChannel | GuildChannel;
export declare type GuildChannel = TextBasedChannel;
