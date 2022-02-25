/// <reference types="node" />
export declare type FileResolvable = string | Buffer;
export declare function resolveFile(file: FileResolvable): Promise<Buffer>;
