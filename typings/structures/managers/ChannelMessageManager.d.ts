import { Snowflake } from 'discord-api-types/v10';
import { MessagePayload, MessagePayloadData } from '../../util/resolvables/MessagePayload';
import { Message } from '../Message';
import { TextChannel } from '../templates/BaseTextChannel';
import { BaseManager } from './BaseManager';
export declare class ChannelMessageManager extends BaseManager<Message<TextChannel>> {
    channel: TextChannel;
    constructor(channel: TextChannel);
    create(data: MessagePayload | MessagePayloadData | string, cache?: boolean): Promise<Message<TextChannel>>;
    fetch(id: Snowflake, cache?: boolean): Promise<Message<TextChannel>>;
    delete(id: Snowflake, reason?: string): Promise<boolean>;
}
