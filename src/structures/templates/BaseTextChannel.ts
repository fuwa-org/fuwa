import {
  APITextBasedChannel,
  TextChannelType,
} from '@splatterxl/discord-api-types';
import { Snowflake } from '../../client/ClientOptions';
import { MessagePayload } from '../../util/resolvables/MessagePayload';
import { Channel } from '../Channel.js';
import { DMChannel } from '../DMChannel';
import { GuildTextChannel } from '../GuildTextChannel';
import { ChannelMessageManager } from '../managers/ChannelMessageManager';

export class BaseTextChannel extends Channel<
  APITextBasedChannel<TextChannelType>
> {
  public lastMessageId: Snowflake | null = null;

  public messages = new ChannelMessageManager(this as unknown as TextChannel);

  _deserialise(data: APITextBasedChannel<TextChannelType>) {
    super._deserialise(data);

    if ('last_message_id' in data) {
      this.lastMessageId = data.last_message_id! as Snowflake;
    }

    return this;
  }

  public createMessage(data: MessagePayload | string) {
    return this.messages.create(data);
  }
}

export type TextChannel = DMChannel | GuildTextChannel;
