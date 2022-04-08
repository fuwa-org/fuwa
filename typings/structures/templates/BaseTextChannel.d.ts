import { APITextBasedChannel, TextChannelType } from 'discord-api-types/v10';
import { Client } from '../../client/Client';
import { Snowflake } from '../../client/ClientOptions';
import { MessagePayload } from '../../util/resolvables/MessagePayload';
import { Channel } from '../Channel.js';
import { DMChannel } from '../DMChannel';
import { GuildChannel } from '../GuildChannel';
import { GuildTextChannel } from '../GuildTextChannel';
import { ChannelMessageManager } from '../managers/ChannelMessageManager';
export interface BaseTextChannel extends Channel<APITextBasedChannel<TextChannelType>> {
    lastMessageId: Snowflake | null;
    messages: ChannelMessageManager;
    _deserialise(data: APITextBasedChannel<TextChannelType>): this;
    createMessage(data: MessagePayload | string): ReturnType<ChannelMessageManager['create']>;
}
export declare class BaseTextChannelInGuild extends GuildChannel implements BaseTextChannel {
    lastMessageId: Snowflake | null;
    messages: ChannelMessageManager;
    _deserialise(data: any): this;
    createMessage(data: MessagePayload | string): Promise<import("../Message").Message<TextChannel>>;
}
export declare const BaseTextChannel: new (client: Client) => BaseTextChannel;
export declare type TextChannel = DMChannel | GuildTextChannel;
