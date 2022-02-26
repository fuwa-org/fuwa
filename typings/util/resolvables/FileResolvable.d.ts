/// <reference types="node" />
export declare type FileResolvable = string | Buffer;
export declare function resolveFile(file: FileResolvable): Promise<ResolvedFile>;
export interface ResolvedFile {
    mimeType: string;
    data: Buffer;
}
export declare function toDataURI(file: ResolvedFile): string;
export declare const MIME_TYPES: {
    '.png': string;
    '.jpg': string;
    '.jpeg': string;
    '.gif': string;
    '.webp': string;
    '.mp4': string;
    '.webm': string;
    '.mp3': string;
    '.ogg': string;
    '.wav': string;
    '.flac': string;
};
export declare function mimeTypeFromExtension(ext: string): string;
