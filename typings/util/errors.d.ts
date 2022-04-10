import { ArgumentType } from './util';
export declare class FuwaError<T extends keyof typeof messages> extends Error {
    constructor(key: T, ...args: ArgumentType<(typeof messages)[T]>);
}
declare const messages: {
    readonly INVALID_TOKEN: () => string;
    readonly INVALID_PARAMETER: (name: string, constraint: string) => string;
    readonly FILE_RESOLVE_ERROR: (path: string, status: number) => string;
};
export {};
