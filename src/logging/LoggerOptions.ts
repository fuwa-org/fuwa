import { KleurFactory } from './ILogger.js';

let kleur: any;
try {
  kleur = require('kleur');
} catch {
  // it's not installed
}

export interface LoggerOptions {
  colors?: boolean | KleurFactory;
  level?: LogLevel | LogLevel[];
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export const DefaultLoggerOptions: LoggerOptions = {
  colors: true,
  level: ['info', 'warn', 'error'],
};

export function DefaultKleurFactory() {
  if (kleur) return kleur;
  else {
    return DisabledKleurFactory();
  }
}

export function DisabledKleurFactory() {
  const handler = () => {
    return (v: any) => {
      if (v) return v;
      else
        return new Proxy(
          {},
          {
            get: handler,
          },
        );
    };
  };
  return new Proxy(
    {},
    {
      get: handler,
    },
  );
}
