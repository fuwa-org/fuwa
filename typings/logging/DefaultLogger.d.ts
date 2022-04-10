import { ILogger } from './ILogger.js';
import { LoggerOptions, LogLevel } from './LoggerOptions.js';
declare type TLoggerOptions = Required<LoggerOptions> & {
    level: LogLevel[];
};
export declare class DefaultLogger implements ILogger {
    options: TLoggerOptions;
    constructor(options?: LoggerOptions);
    kleur(): any;
    info(...data: any[]): void;
    warn(...data: any[]): void;
    error(...data: any[]): void;
    debug(...data: any[]): void;
    trace(...data: any[]): void;
    log(level: string, ...data: any[]): void;
}
export {};
