import { ILogger } from './ILogger.js';
import { DefaultKleurFactory } from './LoggerOptions.js';

/** @internal */
export class DisabledLogger implements ILogger {
  public info(..._data: any[]): void {
    // noop
  }

  public warn(..._data: any[]): void {
    // noop
  }

  public error(..._data: any[]): void {
    // noop
  }

  public debug(..._data: any[]): void {
    // noop
  }

  public kleur() {
    return DefaultKleurFactory();
  }
}
