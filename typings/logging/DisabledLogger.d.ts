import { ILogger } from './ILogger.js';
export declare class DisabledLogger implements ILogger {
    info(...data: any[]): void;
    warn(...data: any[]): void;
    error(...data: any[]): void;
    debug(...data: any[]): void;
    kleur(): any;
}
