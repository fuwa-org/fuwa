import { KleurFactory } from './ILogger.js';
export interface LoggerOptions {
    colors?: boolean | KleurFactory;
    level?: LogLevel | LogLevel[];
}
export declare type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export declare const DefaultLoggerOptions: LoggerOptions;
export declare function DefaultKleurFactory(): any;
export declare function DisabledKleurFactory(): {};
