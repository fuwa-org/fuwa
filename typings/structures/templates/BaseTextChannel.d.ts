import { APITextBasedChannel, TextChannelType } from '@splatterxl/discord-api-types';
import { Snowflake } from '../../client/ClientOptions';
import { MessagePayload } from '../../util/resolvables/MessagePayload';
import { Channel } from '../Channel.js';
import { DMChannel } from '../DMChannel';
import { GuildTextChannel } from '../GuildTextChannel';
import { ChannelMessageManager } from '../managers/ChannelMessageManager';
export declare class BaseTextChannel extends Channel<APITextBasedChannel<TextChannelType>> {
    lastMessageId: Snowflake | null;
    messages: ChannelMessageManager;
    _deserialise(data: APITextBasedChannel<TextChannelType>): this;
    createMessage(data: MessagePayload | string): Promise<import("../Message").Message<TextChannel>>;
}
export declare type TextChannel = DMChannel | GuildTextChannel;
