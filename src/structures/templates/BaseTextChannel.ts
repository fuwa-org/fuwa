import {
  APITextBasedChannel,
  GuildTextChannelType,
} from '@splatterxl/discord-api-types';
import { Snowflake } from '../../client/ClientOptions';
import { GuildChannel } from '../GuildChannel';
import { ChannelMessageManager } from '../managers/ChannelMessageManager';

export class BaseTextChannel extends GuildChannel<
  APITextBasedChannel<GuildTextChannelType>
> {
  public lastMessageId: Snowflake | null = null;

  public messages = new ChannelMessageManager(this);

  _deserialise(data: APITextBasedChannel<GuildTextChannelType>) {
    super._deserialise(data);

    if ('last_message_id' in data) {
      this.lastMessageId = data.last_message_id! as Snowflake;
    }

    return this;
  }
}
