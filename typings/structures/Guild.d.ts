import Collection from '@discordjs/collection';
import { APIGuild } from 'discord-api-types';
import { Client } from '../client';
import { Base } from './Base';
import { GuildChannel } from './GuildChannel';
export declare class Guild extends Base<APIGuild> {
    /** The guild's {@link GuildChannel|channel}s.
     *
     * <info> **ALL** channels in the guild are cached. This does not mean, however, that the Client has access to these channels.</info>
     */
    channels: Collection<`${bigint}`, GuildChannel>;
    constructor(client: Client, data: APIGuild);
    _patch(data: APIGuild): void;
}
