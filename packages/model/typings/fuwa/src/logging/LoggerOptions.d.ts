import { KleurFactory } from './ILogger.js';
export interface LoggerOptions {
    colors?: boolean | KleurFactory;
    level?: LogLevel | LogLevel[];
}
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'trace';
export declare const DefaultLoggerOptions: LoggerOptions;
export declare function DefaultKleurFactory(): any;
export declare function hasKleur(): boolean;
export declare function DisabledKleurFactory(): {};
