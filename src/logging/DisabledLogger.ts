import { ILogger } from './ILogger.js';
import { DefaultKleurFactory } from './LoggerOptions.js';

/** @internal */
export class DisabledLogger implements ILogger {
  public info(...data: any[]): void {
    // noop
  }

  public warn(...data: any[]): void {
    // noop
  }

  public error(...data: any[]): void {
    // noop
  }

  public debug(...data: any[]): void {
    // noop
  }

  public kleur() {
    return DefaultKleurFactory({
      colors: false,
    });
  }
}
