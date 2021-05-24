import Collection from '@discordjs/collection';
import { APIChannelMention, APIMessage, Snowflake } from 'discord-api-types';
import { Client } from '../client';
import { User } from './User';
/** Keeps track of mentions in a {@link Message} */
export declare class MessageMentions {
    /** Channels mentioned in the message. */
    channels: APIChannelMention[];
    client: Client;
    /** Whether or not @everyone/@here has been mentioned. */
    everyone: boolean;
    /** Roles mentioned in the message. */
    roles: Snowflake[];
    /** {@link User}s mentioned in the message. */
    users: Collection<`${bigint}`, User>;
    constructor(client: Client, users: APIMessage['mentions'], roles: Snowflake[], everyone: boolean, channels?: APIChannelMention[]);
}
