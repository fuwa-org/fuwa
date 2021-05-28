import { APIChannel } from 'discord-api-types';
import { Client } from '../client';
import { MessageManager } from '../managers/MessageManager';
import { Channel } from './Channel';

export class TextBasedChannel extends Channel {
  messages: MessageManager;
  constructor(client: Client, data: APIChannel) {
    super(client, data);
    this.id = data.id;
    this.messages = new MessageManager(this.client, { ...this, id: this.id });
  }
}
