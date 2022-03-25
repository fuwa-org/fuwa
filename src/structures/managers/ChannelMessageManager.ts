import { Routes } from '@splatterxl/discord-api-types';
import {
  MessagePayload,
  payload2data,
} from '../../util/resolvables/MessagePayload';
import { Message } from '../Message';
import { TextChannel } from '../templates/BaseTextChannel';
import { BaseManager } from './BaseManager';

export class ChannelMessageManager extends BaseManager<Message<TextChannel>> {
  constructor(public channel: TextChannel) {
    super(channel.client, Message);
  }

  public async create(
    data: MessagePayload | string
  ): Promise<Message<TextChannel>> {
    data = MessagePayload.from(data);

    const message = new Message(this.client)._deserialise(
      await this.client.http
        .queue(await payload2data(data, this.channel.id))
        .then(async (d) => d.body.json())
    );

    return message;
  }

  public async fetch(id: string): Promise<Message<TextChannel>> {
    const message = await this.client.http
      .queue({
        route: Routes.channelMessage(this.channel.id, id),
      })
      .then(async (d) => this.resolve(await d.body.json())!);

    return message;
  }
}
