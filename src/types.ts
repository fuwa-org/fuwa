import Collection from '@discordjs/collection';
import {
  APIEmbed,
  APIInteractionDataResolvedGuildMember,
  APIRole,
  ApplicationCommandOptionType, // as ApplicationCommandInteractionDataOptionType,
  Snowflake,
} from 'discord-api-types';
import { DMChannel } from './structures/DMChannel.js';
import { Message } from './structures/Message.js';
import { TextBasedChannel } from './structures/TextBasedChannel.js';
import { User } from './structures/User.js';
export type ImageFormat = 'webp' | 'gif' | 'jpg' | 'jpeg' | 'png';
export type ImageSize = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;
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
export type MessageContent = string;
export interface MessageOptions {
  content?: MessageContent;
  embed?: APIEmbed;
  allowedMentions?: MessageAllowedMentions;
  replyTo?: MessageReplyTo;
}

export type MessageReplyTo =
  | Message
  | Snowflake
  | {
      id: Snowflake;
      channel: Snowflake;
      guild?: Snowflake;
      failIfNotExists?: boolean;
    };

//#region Interactions
export type InteractionData =
  | ApplicationCommandData
  | MessageComponentInteractionData;
//#region Application Commands
export type ApplicationCommandDataOption =
  | ApplicationCommandDataOptionSubCommand
  | ApplicationCommandDataOptionSubCommandGroup;
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
export interface InteractionDataOptionBase<
  T extends ApplicationCommandOptionType,
  D = unknown
> {
  name: string;
  type: T;
  value: D;
}
export type ApplicationCommandInteractionDataOptionWithValues =
  | ApplicationCommandInteractionDataOptionString
  | ApplicationCommandInteractionDataOptionRole
  | ApplicationCommandInteractionDataOptionChannel
  | ApplicationCommandInteractionDataOptionUser
  | ApplicationCommandInteractionDataOptionMentionable
  | ApplicationCommandInteractionDataOptionInteger
  | ApplicationCommandInteractionDataOptionBoolean;
export type ApplicationCommandInteractionDataOptionString =
  InteractionDataOptionBase<ApplicationCommandOptionType.String, string>;
export type ApplicationCommandInteractionDataOptionRole =
  InteractionDataOptionBase<ApplicationCommandOptionType.Role, Snowflake>;
export type ApplicationCommandInteractionDataOptionChannel =
  InteractionDataOptionBase<ApplicationCommandOptionType.Channel, Snowflake>;
export type ApplicationCommandInteractionDataOptionUser =
  InteractionDataOptionBase<ApplicationCommandOptionType.User, Snowflake>;
export type ApplicationCommandInteractionDataOptionMentionable =
  InteractionDataOptionBase<
    ApplicationCommandOptionType.Mentionable,
    Snowflake
  >;
export type ApplicationCommandInteractionDataOptionInteger =
  InteractionDataOptionBase<ApplicationCommandOptionType.Integer, number>;
export type ApplicationCommandInteractionDataOptionBoolean =
  InteractionDataOptionBase<ApplicationCommandOptionType.Boolean, boolean>;
//#endregion
//#region Message Components
export type MessageComponentInteractionData =
  | MessageButtonInteractionData
  | MessageSelectMenuInteractionData;
// Buttons
export interface MessageButtonInteractionData {
  customID: string;
  componentType: 'button';
}
// Select Menus
export interface MessageSelectMenuInteractionData {
  customID: string;
  componentType: 'selectMenu';
  values: string[];
}
//#endregion
//#endregion
export type Channel = DMChannel | GuildChannel;
export type GuildChannel = TextBasedChannel;
