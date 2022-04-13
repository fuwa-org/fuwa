import { APIAttachment } from 'discord-api-types/v10';
import { BaseStructure } from './templates/BaseStructure';
export declare class MessageAttachment extends BaseStructure<APIAttachment> {
    url: string;
    proxyURL: string;
    filename: string;
    description: string | null;
    size: number;
    width: number | null;
    height: number | null;
    ephemeral: true | null;
    contentType: string | null;
    _deserialise(data: APIAttachment): this;
    toJSON(): APIAttachment;
}
