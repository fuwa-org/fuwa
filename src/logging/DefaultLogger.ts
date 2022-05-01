import { ILogger } from './ILogger.js';
import util from 'node:util';
import {
  DefaultKleurFactory,
  hasKleur,
  LoggerOptions,
  LogLevel,
} from './LoggerOptions.js';
import { DataResolver } from '../util/DataResolver.js';

type TLoggerOptions = Required<LoggerOptions> & {
  level: LogLevel[];
};

export class DefaultLogger implements ILogger {
  public options: TLoggerOptions = {
    colors: false,
    level: [],
  };

  constructor(options: LoggerOptions = {}) {
    if (typeof options.level === 'string')
      options.level = DataResolver.logLevel(options.level);
    if (typeof options.colors === 'function') this.kleur = options.colors;
    else if (hasKleur()) options.colors = true;
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

  public trace(...data: any[]): void {
    if (this.options.level.includes('trace')) {
      this.log(
        `${this.kleur().gray('trace:')}`,
        this.kleur().gray(
          data
            .map(v =>
              typeof v === 'string' ? v : util.inspect(v, false, null, false),
            )
            .join(' '),
        ),
      );
    }
  }

  public log(...data: any[]): void {
    (process.env.NODE_ENV === 'development'
      ? console.log
      : process.stdout.write.bind(process.stdout))(
      data
        .map(d =>
          typeof d === 'string'
            ? d
            : util.inspect(d, {
                depth: 1,
                colors: !!this.options.colors,
              }),
        )
        .join(' ') + '\n',
    );
  }
}
