import {
  APIChannelMention,
  ChannelType,
  Snowflake,
} from 'discord-api-types/v10';
import { BaseStructure } from '../BaseStructure';

export class ChannelMention extends BaseStructure<APIChannelMention> {
  id: Snowflake;
  guildId: Snowflake | null;
  type: ChannelType;
  name: string | null;

  constructor(data: APIChannelMention) {
    super(data);

    this.id = data.id;
    this.guildId = data.guild_id ?? null;
    this.type = data.type;
    this.name = data.name ?? null;
  }

  toJSON(): APIChannelMention {
    return {
      id: this.id,
      guild_id: this.guildId!,
      type: this.type,
      name: this.name!,
    };
  }
}
