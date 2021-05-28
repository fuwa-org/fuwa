import { RESTPostAPIChannelMessageResult } from 'discord-api-types';
import { Client } from '../client';
import { CONSTANTS } from '../constants';
import { Message } from '../structures/Message';
import { TextBasedChannel } from '../structures/TextBasedChannel';
import { BaseManager } from './BaseManager';

export class MessageManager extends BaseManager<Message> {
  channel: TextBasedChannel;
  constructor(client: Client, channel: TextBasedChannel) {
    super(client);
    this.channel = channel;
  }
  async create(content: string): Promise<Message> {
    const result = await this.client.request<
      void,
      RESTPostAPIChannelMessageResult
    >(CONSTANTS.urls.channelMessages(this.channel.id), {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        content,
      },
      method: 'POST',
    });
    if (!result.res.ok) throw result.data;
    return new Message(this.client, result.data);
  }
}
