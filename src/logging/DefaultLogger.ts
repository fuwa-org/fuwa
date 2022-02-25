import { ILogger } from './ILogger.js';
import util from 'node:util';
import {
  DefaultKleurFactory,
  LoggerOptions,
  LogLevel,
} from './LoggerOptions.js';

type TLoggerOptions = Required<LoggerOptions> & {
  level: LogLevel[];
};

let kleur: any;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  kleur = require('kleur');
} catch {
  // it's not installed
}

export class DefaultLogger implements ILogger {
  public options: TLoggerOptions = {
    colors: false,
    level: [],
  };

  constructor(options: LoggerOptions = {}) {
    if (typeof options.level === 'string') options.level = [options.level];
    if (typeof options.colors === 'function') this.kleur = options.colors;
    this.options = Object.assign(this.options, options) as TLoggerOptions;
  }

  /** Utility function to supply a color formatter if it's installed, and to fallback to a proxy if not */
  public kleur() {
    return DefaultKleurFactory();
  }

  public info(...data: any[]): void {
    if (this.options.level.includes('info')) {
      this.log(`${this.kleur().blue('info')}:`, ...data);
    }
  }

  public warn(...data: any[]): void {
    if (this.options.level.includes('warn')) {
      this.log(`${this.kleur().yellow('warn')}:`, ...data);
    }
  }

  public error(...data: any[]): void {
    if (this.options.level.includes('error')) {
      this.log(`${this.kleur().redBright('error')}:`, ...data);
    }
  }

  public debug(...data: any[]): void {
    if (this.options.level.includes('debug')) {
      this.log(`${this.kleur().gray('debug')}:`, ...data);
    }
  }

  public log(...data: any[]): void {
    process.stdout.write(
      data
        .map((d) =>
          typeof d === 'string'
            ? d
            : util.inspect(d, {
                depth: 1,
                colors: !!this.options.colors,
              })
        )
        .join(' ') + '\n'
    );
  }
}
