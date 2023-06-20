import { APIRole, Snowflake } from 'discord-api-types/v10';
import { BaseStructure } from './BaseStructure';

export class Role extends BaseStructure<APIRole> {
  id: Snowflake;
  name: string;
  color: number;
  hoist: boolean;
  icon: string | null;

  unicodeEmoji: string | null;

  position: number;
  permissions: string;
  managed: boolean;
  mentionable: boolean;

  // TODO: role tags
  tags = null;

  constructor(data: APIRole) {
    super(data);

    this.id = data.id;
    this.name = data.name;
    this.color = data.color;
    this.hoist = data.hoist;
    this.icon = data.icon ?? null;

    this.unicodeEmoji = data.unicode_emoji ?? null;
    this.position = data.position;
    this.permissions = data.permissions;
    this.managed = data.managed;
    this.mentionable = data.mentionable;

    // TODO
    // this.tags = data.tags;
  }

  toJSON(): APIRole {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      hoist: this.hoist,
      icon: this.icon,
      unicode_emoji: this.unicodeEmoji,
      position: this.position,
      permissions: this.permissions,
      managed: this.managed,
      mentionable: this.mentionable,
    };
  }
}
