import { APITextBasedChannel, TextChannelType, Snowflake } from 'discord-api-types/v10';
import { Client } from '../../client/Client';
import { MessagePayload, MessagePayloadData } from '../../util/resolvables/MessagePayload';
import { Channel } from '../Channel.js';
import { DMChannel } from '../DMChannel';
import { GuildChannel } from '../GuildChannel';
import { GuildTextChannel } from '../GuildTextChannel';
import { GuildVoiceChannel } from '../GuildVoiceChannel.js';
import { ChannelMessageManager } from '../managers/ChannelMessageManager';
export interface BaseTextChannel extends Channel {
    lastMessageId: Snowflake | null;
    messages: ChannelMessageManager;
    _deserialise(data: APITextBasedChannel<TextChannelType>): this;
    createMessage(data: MessagePayload | MessagePayloadData | string): ReturnType<ChannelMessageManager['create']>;
}
export declare class BaseTextChannelInGuild extends GuildChannel implements BaseTextChannel {
    lastMessageId: Snowflake | null;
    messages: ChannelMessageManager;
    constructor(client: Client);
    _deserialise(data: any): this;
    get createMessage(): (data: string | MessagePayloadData | MessagePayload, cache?: boolean) => Promise<import("../Message").Message<TextChannel>>;
}
export declare const BaseTextChannel: new (client: Client) => BaseTextChannel;
export declare type TextChannel = DMChannel | GuildTextChannel | GuildVoiceChannel;
