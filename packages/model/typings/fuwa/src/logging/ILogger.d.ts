export interface ILogger {
    info(...data: any[]): void;
    warn(...data: any[]): void;
    error(...data: any[]): void;
    debug(...data: any[]): void;
    trace(...data: any[]): void;
    kleur(): KleurFactory;
}
export type KleurFactory = {
    [k: string]: KleurFactory;
} & (() => KleurFactory) & ((str: string) => string);
