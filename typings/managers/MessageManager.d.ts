import { Client } from '../client';
import { Message } from '../structures/Message';
import { TextBasedChannel } from '../structures/TextBasedChannel';
import { BaseManager } from './BaseManager';
export declare class MessageManager extends BaseManager<Message> {
    channel: TextBasedChannel;
    constructor(client: Client, channel: TextBasedChannel);
    create(content: string): Promise<Message>;
}
