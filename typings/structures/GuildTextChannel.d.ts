import { APIGuildTextChannel, ChannelType } from '@splatterxl/discord-api-types';
import { BaseGuildTextChannel } from './templates/BaseGuildTextChannel';
export declare class GuildTextChannel extends BaseGuildTextChannel {
    topic: string | null;
    _deserialise(data: APIGuildTextChannel<ChannelType.GuildText>): this;
}
