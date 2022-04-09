import { STATUS_CODES } from 'http';

export class FuwaError extends Error {
  constructor(key: string, ...args: any[]) {
    super(...args);
    this.name = 'FuwaError';
    this.message = key;

    if (key in messages) {
      this.message = messages[key](...args);
      this.name += ' [' + key + ']';
    }
  }
}

const messages: Record<string, (...args: any[]) => string> = {
  INVALID_TOKEN: () => 'Invalid token',
  INVALID_PARAMETER: (name: string, constraint: string) =>
    `Invalid parameter ${name}, must be ${constraint}`,
  FILE_RESOLVE_ERROR: (path: string, status: number) =>
    `Failed to resolve file ${path}, status code: ${status} ${STATUS_CODES[status]}`,
};
