import { APIChannel, ChannelType, Snowflake } from 'discord-api-types';
import { Client } from '../client';
import { Base } from './Base';
export class Channel extends Base<APIChannel> {
  id: Snowflake;
  constructor(client: Client, data: APIChannel) {
    super(client, data);
  }
  static from(client: Client, data: APIChannel): DMChannel | GuildChannel {
    if ([ChannelType.DM, ChannelType.GROUP_DM].includes(data.type))
      return new DMChannel(client, data);
    else if (
      [ChannelType.GUILD_NEWS, ChannelType.GUILD_TEXT].includes(data.type)
    )
      return new TextBasedChannel(client, data);
    return new GuildChannel(client, data);
  }
}
import { DMChannel } from './DMChannel';
import { GuildChannel } from './GuildChannel';
import { TextBasedChannel } from './TextBasedChannel';
