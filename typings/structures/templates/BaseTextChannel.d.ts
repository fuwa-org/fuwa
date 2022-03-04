import { APITextBasedChannel, TextChannelType } from '@splatterxl/discord-api-types';
import { Snowflake } from '../../client/ClientOptions';
import { Channel } from '../Channel.js';
import { ChannelMessageManager } from '../managers/ChannelMessageManager';
export declare class BaseTextChannel extends Channel<APITextBasedChannel<TextChannelType>> {
    lastMessageId: Snowflake | null;
    messages: ChannelMessageManager;
    _deserialise(data: APITextBasedChannel<TextChannelType>): this;
}
