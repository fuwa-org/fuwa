import { APIChannel, Snowflake } from 'discord-api-types';
import { Client } from '../client';
import { Base } from './Base';
export declare class Channel extends Base<APIChannel> {
    id: Snowflake;
    constructor(client: Client, data: APIChannel);
    static from(client: Client, data: APIChannel): DMChannel | GuildChannel;
}
import { DMChannel } from './DMChannel';
import { GuildChannel } from './GuildChannel';
