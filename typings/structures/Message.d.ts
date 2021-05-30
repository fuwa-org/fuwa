import { APIEmbed, APIMessage, MessageType, Snowflake } from 'discord-api-types';
import { Client } from '../client';
import { MessageContent, MessageOptions } from '../types';
import { MessageFlags } from '../util/MessageFlags';
import { Base } from './Base';
import { MessageMentions } from './MessageMentions';
import { TextBasedChannel } from './TextBasedChannel';
import { User } from './User';
/** A Message sent in a text based channel. */
export declare class Message extends Base<APIMessage> {
    /** The message's author */
    author: User;
    /** The Channel the message was sent in. */
    channel: TextBasedChannel;
    /** The message's content. */
    content: string;
    /** Whether this message has been deleted or not. */
    deleted: boolean;
    /** The message's embeds. */
    embeds: APIEmbed[];
    /** The message's flags. */
    flags: MessageFlags;
    /** The {@link Guild} this message was created in */
    guild: Snowflake;
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
    private _resolveMessage;
    delete(): Promise<this>;
    edit(content: MessageContent, options?: MessageOptions): Promise<this>;
    /**
     * Send an inline reply to the message
     * @returns The new message.
     */
    reply(content: string, { embed, allowedMentions, content: optionsDotContent, replyTo, }?: MessageOptions): Promise<Message>;
}
