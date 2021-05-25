import { APIEmbed, Snowflake } from 'discord-api-types';

export type ImageFormat = 'webp' | 'gif' | 'jpg' | 'jpeg' | 'png';
export type ImageSize = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;
export interface ImageURLOptions {
  format: ImageFormat;
  size: ImageSize;
  dynamic: boolean;
}
export { UserPremiumType } from 'discord-api-types';
export interface MessageAllowedMentions {
  parse: ('user' | 'role' | 'everyone')[];
  users: Snowflake[];
  roles: Snowflake[];
}
export type MessageContent = string;
export interface MessageOptions {
  content?: MessageContent;
  embed?: APIEmbed;
  allowedMentions?: MessageAllowedMentions;
}