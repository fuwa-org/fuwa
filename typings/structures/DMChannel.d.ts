import { ChannelType } from 'discord-api-types';
import { TextBasedChannel } from './TextBasedChannel';
export declare class DMChannel extends TextBasedChannel {
    type: ChannelType.DM;
}
