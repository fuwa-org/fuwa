export interface ILogger {
    info(...data: any[]): void;
    warn(...data: any[]): void;
    error(...data: any[]): void;
    debug(...data: any[]): void;
    kleur(): KleurFactory;
}
export declare type KleurFactory = {
    [k: string]: KleurFactory;
} & (() => KleurFactory) & ((str: string) => string);
