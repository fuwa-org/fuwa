import { APIMessage, Routes } from 'discord-api-types/v10';
import { Snowflake } from '../../client/ClientOptions';
import {
  MessagePayload,
  MessagePayloadData,
} from '../../util/resolvables/MessagePayload';
import { Message } from '../Message';
import { TextChannel } from '../templates/BaseTextChannel';
import { BaseManager } from './BaseManager';

export class ChannelMessageManager extends BaseManager<Message<TextChannel>> {
  constructor(public channel: TextChannel) {
    super(channel.client, Message);
  }

  public async create(
    data: MessagePayload | MessagePayloadData | string,
    cache = false,
  ): Promise<Message<TextChannel>> {
    const payload = MessagePayload.from(data);

    return this.client
      .rest(Routes.channelMessages(this.channel.id))
      .post<APIMessage>({ ...(await payload.json()) })
      .then(data => {
        if (cache) {
          return this.resolve(data)!;
        } else {
          return new Message(this.client)._deserialise(data);
        }
      });
  }

  public async fetch(id: Snowflake, cache = false) {
    return this.client
      .rest(Routes.channelMessage(this.channel.id, id))
      .get<APIMessage>()
      .then(data => {
        if (cache) {
          return this.resolve(data)!;
        } else {
          return new Message(this.client)._deserialise(data);
        }
      });
  }

  public async delete(id: Snowflake, reason?: string) {
    return this.client
      .rest(Routes.channelMessage(this.channel.id, id))
      .delete<void>({ reason })
      .then(() => this.cache.delete(id));
  }
}
