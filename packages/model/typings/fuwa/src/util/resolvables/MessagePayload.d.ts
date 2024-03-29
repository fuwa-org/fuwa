/// <reference types="node" />
import { RESTPostAPIChannelMessageJSONBody, MessageFlags as APIMessageFlags } from 'discord-api-types/v10';
import { File } from '@fuwa/rest';
import { MessageEmbed } from '../../structures/MessageEmbed';
import { MessageFlags } from '../bitfields/MessageFlags';
import { FileResolvable } from './FileResolvable';
export interface MessagePayloadData {
    content?: string;
    flags?: MessageFlags | APIMessageFlags;
    tts?: boolean;
    nonce?: string;
    attachments?: (FileResolvable | MessagePayloadAttachment)[];
    reference?: MessagePayloadReference;
    embeds?: MessageEmbed[];
}
export interface MessagePayload extends MessagePayloadData {
}
export declare class MessagePayload {
    static from(value: MessagePayload | string | MessagePayloadData): MessagePayload;
    constructor(data: MessagePayload | MessagePayloadData);
    json(): Promise<{
        body: Partial<RESTPostAPIChannelMessageJSONBody>;
        files: File[];
    }>;
}
export declare class MessagePayloadAttachment {
    options: {
        name?: string;
        url?: string;
        data?: Buffer | string;
        contentType?: string;
        description?: string;
    };
    name: string;
    data: Buffer;
    contentType: string;
    description?: string;
    constructor(options?: {
        name?: string;
        url?: string;
        data?: Buffer | string;
        contentType?: string;
        description?: string;
    });
    resolve(): Promise<this>;
}
export interface MessagePayloadReference {
    message: string;
    channel?: string;
    guild?: string;
    failIfNotExists?: boolean;
}
