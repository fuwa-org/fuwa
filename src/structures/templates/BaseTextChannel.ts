import {
  APITextBasedChannel,
  TextChannelType,
} from '@splatterxl/discord-api-types';
import { Snowflake } from '../../client/ClientOptions';
import { Channel } from '../Channel.js';
import { ChannelMessageManager } from '../managers/ChannelMessageManager';

export class BaseTextChannel extends Channel<
  APITextBasedChannel<TextChannelType>
> {
  public lastMessageId: Snowflake | null = null;

  public messages = new ChannelMessageManager(this);

  _deserialise(data: APITextBasedChannel<TextChannelType>) {
    super._deserialise(data);

    if ('last_message_id' in data) {
      this.lastMessageId = data.last_message_id! as Snowflake;
    }

    return this;
  }
}
