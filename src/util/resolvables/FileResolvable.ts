import undici from 'undici';
import fs from 'fs/promises';

export type FileResolvable = string | Buffer;

export async function resolveFile(file: FileResolvable): Promise<Buffer> {
  if (file instanceof Buffer) return file;
  if (typeof file !== 'string')
    throw new TypeError('Expected a string or Buffer');

  if (/^http(s):/.test(file)) {
    return undici
      .request(file)
      .then((res) => res.body.arrayBuffer())
      .then((buffer) => Buffer.from(buffer));
  } else {
    return fs
      .readFile(file)
      .then((f) => f.buffer)
      .then((b) => Buffer.from(b));
  }
}
