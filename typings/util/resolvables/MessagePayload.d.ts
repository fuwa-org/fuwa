/// <reference types="node" />
import { MessageFlags as APIMessageFlags } from 'discord-api-types/v10';
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
    };
    name: string;
    data: Buffer;
    contentType: string;
    constructor(options?: {
        name?: string;
        url?: string;
        data?: Buffer | string;
        contentType?: string;
    });
    resolve(): Promise<this>;
}
export declare function payload2data(payload: MessagePayload, channel: Snowflake): Promise<APIRequest & {
    body?: Partial<Omit<import("discord-api-types/utils/internals").AddUndefinedToPossiblyUndefinedPropertiesOfInterface<{
        content?: string | undefined;
        nonce?: string | number | undefined;
        tts?: boolean | undefined;
        embeds?: import("discord-api-types/v10").APIEmbed[] | undefined;
        allowed_mentions?: import("discord-api-types/v10").APIAllowedMentions | undefined;
        message_reference?: import("discord-api-types/v10").APIMessageReferenceSend | undefined;
        components?: import("discord-api-types/v10").APIActionRowComponent<import("discord-api-types/v10").APIMessageActionRowComponent>[] | undefined;
        sticker_ids?: [string] | [string, string] | [string, string, string] | undefined;
        attachments?: (Pick<import("discord-api-types/v10").APIAttachment, "id" | "description"> & Partial<Pick<import("discord-api-types/v10").APIAttachment, "filename">>)[] | undefined;
        flags?: APIMessageFlags | undefined;
    }>, "attachments">> | undefined;
}>;
