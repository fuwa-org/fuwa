import { ChannelType } from 'discord-api-types';
import { TextBasedChannel } from './TextBasedChannel';

export class DMChannel extends TextBasedChannel {
  type: ChannelType.DM;
}
