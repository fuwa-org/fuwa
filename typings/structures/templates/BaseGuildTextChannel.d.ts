import { APIGuildTextChannel, GuildTextChannelType } from '@splatterxl/discord-api-types';
import { Client } from '../../client/Client.js';
import { Guild } from '../Guild.js';
import { BaseTextChannel } from './BaseTextChannel.js';
export declare class BaseGuildTextChannel extends BaseTextChannel {
    guild: Guild;
    lastPinAt: Date | null;
    get lastPinTimestamp(): number | null;
    nsfw: boolean;
    constructor(client: Client, guild: Guild);
    _deserialise(data: APIGuildTextChannel<GuildTextChannelType>): this;
}
