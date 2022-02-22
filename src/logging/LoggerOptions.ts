let kleur: any;
try {
  kleur = require('kleur');
} catch {
  // it's not installed
}

export interface LoggerOptions {
  colors?: boolean;
  level?: LogLevel | LogLevel[];
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export const DefaultLoggerOptions: LoggerOptions = {
  colors: true,
  level: ['info', 'warn', 'error'],
};

export function DefaultKleurFactory(options: LoggerOptions = {}) {
  if (options.colors && kleur) return kleur;
  else {
    const handler = () => {
      return (v: any) => {
        if (v) return v;
        else
          return new Proxy(
            {},
            {
              get: handler,
            }
          );
      };
    };
    return new Proxy(
      {},
      {
        get: handler,
      }
    );
  }
}
