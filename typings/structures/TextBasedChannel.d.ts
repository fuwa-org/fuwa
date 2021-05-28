import { APIChannel } from 'discord-api-types';
import { Client } from '../client';
import { MessageManager } from '../managers/MessageManager';
import { Channel } from './Channel';
export declare class TextBasedChannel extends Channel {
    messages: MessageManager;
    constructor(client: Client, data: APIChannel);
}
