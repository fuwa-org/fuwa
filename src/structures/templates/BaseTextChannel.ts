import { APITextBasedChannel, TextChannelType } from 'discord-api-types/v10';
import { Client } from '../../client/Client';
import { Snowflake } from '../../client/ClientOptions';
import { MessagePayload } from '../../util/resolvables/MessagePayload';
import { Channel } from '../Channel.js';
import { DMChannel } from '../DMChannel';
import { GuildChannel } from '../GuildChannel';
import { GuildTextChannel } from '../GuildTextChannel';
import { ChannelMessageManager } from '../managers/ChannelMessageManager';

// i hate this so much
// this is so scuffed

export interface BaseTextChannel
  extends Channel<APITextBasedChannel<TextChannelType>> {
  lastMessageId: Snowflake | null;
  messages: ChannelMessageManager;
  _deserialise(data: APITextBasedChannel<TextChannelType>): this;
  createMessage(
    data: MessagePayload | string
  ): ReturnType<ChannelMessageManager['create']>;
}

// @ts-ignore
export class BaseTextChannelInGuild
  extends GuildChannel
  implements BaseTextChannel
{
  public lastMessageId: Snowflake | null = null;

  public messages = new ChannelMessageManager(this as unknown as TextChannel);

  constructor(client: Client) {
    super(client);

    Object.defineProperty(this, 'messages', {
      enumerable: false,
    });
  }

  _deserialise(data: any) {
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

export const BaseTextChannel = function (
  this: any,
  client: Client
): BaseTextChannel {
  Object.defineProperty(this, 'client', {
    value: client,
  });
  this.lastMessageId = null;
  Object.defineProperty(this, 'createMessage', {
    value: BaseTextChannelInGuild.prototype.createMessage.bind(this),
  });
  Object.defineProperty(this, '_deserialise', {
    value: BaseTextChannelInGuild.prototype._deserialise.bind(this),
  });
  Object.defineProperty(this, 'messages', {
    value: new ChannelMessageManager(this as unknown as TextChannel),
  });

  return this;
} as unknown as {
  new (client: Client): BaseTextChannel;
};

export type TextChannel = DMChannel | GuildTextChannel;
