/// <reference types="node" />
import { RESTPostAPIChannelMessageJSONBody, MessageFlags as APIMessageFlags } from 'discord-api-types/v10';
import { Snowflake } from '../../client/ClientOptions';
import { APIRequest } from '../../rest/APIRequest';
import { MessageFlags } from '../bitfields/MessageFlags';
import { FileResolvable } from './FileResolvable';
export interface MessagePayload {
    content?: string;
    flags?: MessageFlags | APIMessageFlags;
    tts?: boolean;
    nonce?: string;
    attachments?: FileResolvable[] | MessagePayloadAttachment[];
}
export declare class MessagePayload {
    static from(value: MessagePayload | string): MessagePayload;
    constructor(data: MessagePayload | Record<keyof MessagePayload, any>);
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
export declare function payload2data(payload: MessagePayload, channel: Snowflake): Promise<APIRequest<RESTPostAPIChannelMessageJSONBody>>;
