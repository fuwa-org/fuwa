/// <reference types="node" />
import { File } from '../../rest/APIRequest';
import { RequestManager } from '../../rest/RequestManager';
export declare type FileResolvable = string | Buffer;
export declare function resolveFile(file: FileResolvable, reqMan?: RequestManager): Promise<ResolvedFile>;
export interface ResolvedFile {
    mimeType: string;
    data: Buffer;
    filename?: string;
}
export declare function toDataURI(file: ResolvedFile): string;
export declare function toFile(file: ResolvedFile): File;
export declare const MIME_TYPES: {
    readonly '.png': "image/png";
    readonly '.jpg': "image/jpeg";
    readonly '.jpeg': "image/jpeg";
    readonly '.gif': "image/gif";
    readonly '.webp': "image/webp";
    readonly '.mp4': "video/mp4";
    readonly '.webm': "video/webm";
    readonly '.mp3': "audio/mpeg";
    readonly '.ogg': "audio/ogg";
    readonly '.wav': "audio/wav";
    readonly '.flac': "audio/flac";
};
export declare function mimeTypeFromExtension(ext: string): string;
