import { ILogger } from './ILogger.js';
export declare class DisabledLogger implements ILogger {
    info(..._data: any[]): void;
    warn(..._data: any[]): void;
    error(..._data: any[]): void;
    debug(..._data: any[]): void;
    kleur(): any;
}
