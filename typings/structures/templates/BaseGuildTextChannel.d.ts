import { APIGuildTextChannel, GuildTextChannelType } from 'discord-api-types/v10';
import { Client } from '../../client/Client.js';
import { BaseTextChannelInGuild } from './BaseTextChannel.js';
export declare class BaseGuildTextChannel extends BaseTextChannelInGuild {
    lastPinAt: Date | null;
    get lastPinTimestamp(): number;
    nsfw: boolean;
    constructor(client: Client);
    _deserialise(data: APIGuildTextChannel<GuildTextChannelType>): this;
}
