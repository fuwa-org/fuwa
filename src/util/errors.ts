import { STATUS_CODES } from 'http';
import type { ArgumentType } from './util';

export class FuwaError<T extends keyof typeof messages> extends Error {
  constructor(key: T, ...args: ArgumentType<typeof messages[T]>) {
    super();
    this.name = 'FuwaError';
    this.message = key;

    if (key in messages) {
      // @ts-ignore
      this.message = messages[key](...args);
      this.name += ' [' + key + ']';
    }
  }

  setError(error: Error) {
    if (error && error.stack) {
      this.stack =
        `${this.name}: ${this.message}\n` +
        error.stack?.replace(/^[^\n]*\n/, '');
    }
  }
}

const messages = {
  INVALID_TOKEN: () => 'Invalid token',
  INVALID_PARAMETER: (name: string, constraint: string) =>
    `Invalid parameter "${name}"\n=> must be ${constraint}`,
  FILE_RESOLVE_ERROR: (path: string, status: number) =>
    `Failed to resolve file ${path}, status code: ${status} ${STATUS_CODES[status]}`,
} as const;
