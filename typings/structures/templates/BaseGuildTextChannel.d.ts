import { APIGuildTextChannel, GuildTextChannelType } from '@splatterxl/discord-api-types';
import { Client } from '../../client/Client.js';
import { BaseTextChannel } from './BaseTextChannel.js';
export declare class BaseGuildTextChannel extends BaseTextChannel {
    lastPinAt: Date | null;
    get lastPinTimestamp(): number | null;
    nsfw: boolean;
    constructor(client: Client);
    _deserialise(data: APIGuildTextChannel<GuildTextChannelType>): this;
}
