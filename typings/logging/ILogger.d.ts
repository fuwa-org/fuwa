export interface ILogger {
    info(...data: any[]): void;
    warn(...data: any[]): void;
    error(...data: any[]): void;
    debug(...data: any[]): void;
    /** Coloring function, use {@link DefaultKleurFactory} if you're unsure on how to implement this. */
    kleur(): KleurFactory;
}
export declare type KleurFactory = {
    [k: string]: KleurFactory;
} & (() => KleurFactory) & ((str: string) => string);
