import { APIGuildTextChannel, ChannelType } from 'discord-api-types/v10';
import { BaseGuildTextChannel } from './templates/BaseGuildTextChannel';
export declare class GuildTextChannel extends BaseGuildTextChannel {
    topic: string | null;
    _deserialise(data: APIGuildTextChannel<ChannelType.GuildText>): this;
    toJSON(): APIGuildTextChannel<ChannelType.GuildText>;
}
