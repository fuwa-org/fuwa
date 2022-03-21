/// <reference types="node" />
import { MessageFlags as APIMessageFlags } from "@splatterxl/discord-api-types";
import { Snowflake } from "../../client/ClientOptions";
import { APIRequest } from "../../rest/APIRequest";
import { MessageFlags } from "../bitfields/MessageFlags";
import { FileResolvable } from "./FileResolvable";
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
    body?: Partial<Omit<import("@splatterxl/discord-api-types/utils/internals").AddUndefinedToPossiblyUndefinedPropertiesOfInterface<{
        content?: string | undefined;
        nonce?: string | number | undefined;
        tts?: boolean | undefined;
        embeds?: import("@splatterxl/discord-api-types").APIEmbed[] | undefined;
        allowed_mentions?: import("@splatterxl/discord-api-types").APIAllowedMentions | undefined;
        message_reference?: import("@splatterxl/discord-api-types").APIMessageReferenceSend | undefined;
        components?: import("@splatterxl/discord-api-types").APIActionRowComponent<import("@splatterxl/discord-api-types").APIMessageActionRowComponent>[] | undefined;
        sticker_ids?: [string] | [string, string] | [string, string, string] | undefined;
        attachments?: (Pick<import("@splatterxl/discord-api-types").APIAttachment, "id" | "description"> & Partial<Pick<import("@splatterxl/discord-api-types").APIAttachment, "filename">>)[] | undefined;
        flags?: APIMessageFlags | undefined;
    }>, "attachments">> | undefined;
}>;
