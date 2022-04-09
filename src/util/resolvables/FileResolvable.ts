import undici from 'undici';
import fs from 'fs/promises';
import { File } from '../../rest/APIRequest';
import { basename } from 'path';
import { RequestManager } from '../../rest/RequestManager';
import { FuwaError } from '../errors';

export type FileResolvable = string | Buffer;

export async function resolveFile(
  file: FileResolvable,
  reqMan?: RequestManager,
): Promise<ResolvedFile> {
  if (file instanceof Buffer) return { data: file, mimeType: 'image/png' };
  if (typeof file !== 'string')
    throw new TypeError('Expected a string or Buffer');

  if (/^http(s):/.test(file)) {
    const res = reqMan
      ? await reqMan.queue({
          route: file,
          useRateLimits: false,
          useBaseUrl: false,
        })
      : await undici.request(file);

    if (res.statusCode !== 200)
      throw new FuwaError('FILE_RESOLVE_ERROR', file, res.statusCode);

    const data = Buffer.from(await res.body.arrayBuffer());
    let mimeType = mimeTypeFromExtension(file.split('.').pop()!);

    if (res.headers['content-type']) {
      mimeType = res.headers['content-type'].split(';')[0];
    }

    return { data, mimeType, filename: basename(file) };
  } else {
    const stat = await fs.stat(file);
    if (!stat.isFile()) throw new TypeError('Expected a file');

    const data = await fs
      .readFile(file)
      .then(f => f.buffer)
      .then(b => Buffer.from(b));
    const mimeType = mimeTypeFromExtension(file.split('.').pop()!);

    return { data, mimeType, filename: basename(file) };
  }
}

export interface ResolvedFile {
  mimeType: string;
  data: Buffer;
  filename?: string;
}

export function toDataURI(file: ResolvedFile): string {
  return `data:${file.mimeType};base64,${file.data.toString('base64')}`;
}

export function toFile(file: ResolvedFile): File {
  return {
    data: file.data,
    contentType: file.mimeType,
  };
}

export const MIME_TYPES = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
  '.flac': 'audio/flac',
} as const;

export function mimeTypeFromExtension(ext: string): string {
  return (
    MIME_TYPES[ext as keyof typeof MIME_TYPES] || 'application/octet-stream'
  );
}
