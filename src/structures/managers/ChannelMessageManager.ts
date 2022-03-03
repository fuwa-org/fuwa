import { Message } from '../Message';
import { BaseTextChannel } from '../templates/BaseTextChannel';
import { BaseManager } from './BaseManager';

export class ChannelMessageManager extends BaseManager<
  Message<BaseTextChannel>
> {
  constructor(public channel: BaseTextChannel) {
    super(channel.client, Message);
  }
}
