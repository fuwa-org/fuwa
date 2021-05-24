import { APIEmbed, APIMessage, MessageType, Snowflake } from 'discord-api-types';
import { Client } from '../client';
import { MessageFlags } from '../util/MessageFlags';
import { Base } from './Base';
import { MessageMentions } from './MessageMentions';
import { User } from './User';
/** A Message sent in a text based channel. */
export declare class Message extends Base {
    /** The message's author */
    author: User;
    /** The {@link Channel} the message was sent in. */
    channel: Snowflake;
    /** The message's content. */
    content: string;
    /** The message's embeds. */
    embeds: APIEmbed[];
    /** The message's flags. */
    flags: MessageFlags;
    /** The {@link Snowflake} of the message. */
    id: Snowflake;
    /** Entities this message mentions */
    mentions: MessageMentions;
    /** A nonce that can be used for optimistic message sending (up to 25 characters) */
    nonce: string | number;
    /** Whether this is a TTS message */
    tts: boolean;
    /** The type of the message */
    type: MessageType;
    constructor(client: Client, data: APIMessage);
    _patch(data: APIMessage): void;
}