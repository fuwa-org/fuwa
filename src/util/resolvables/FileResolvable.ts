import undici from 'undici';
import fs from 'fs/promises';

export type FileResolvable = string | Buffer;

export async function resolveFile(file: FileResolvable): Promise<ResolvedFile> {
  if (file instanceof Buffer) return { data: file, mimeType: 'image/png' };
  if (typeof file !== 'string')
    throw new TypeError('Expected a string or Buffer');

  if (/^http(s):/.test(file)) {
    const res = await undici.request(file);
    const data = Buffer.from(await res.body.arrayBuffer());
    let mimeType = mimeTypeFromExtension(file.split('.').pop()!);

    if (res.headers['content-type']) {
      mimeType = res.headers['content-type'].split(';')[0];
    }

    return { data, mimeType };
  } else {
    const stat = await fs.stat(file);
    if (!stat.isFile()) throw new TypeError('Expected a file');

    const data = await fs
      .readFile(file)
      .then((f) => f.buffer)
      .then((b) => Buffer.from(b));
    const mimeType = mimeTypeFromExtension(file.split('.').pop()!);

    return { data, mimeType };
  }
}

export interface ResolvedFile {
  mimeType: string;
  data: Buffer;
}

export function toDataURI(file: ResolvedFile): string {
  return `data:${file.mimeType};base64,${file.data.toString('base64')}`;
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
};

export function mimeTypeFromExtension(ext: string): string {
  return (
    MIME_TYPES[ext as keyof typeof MIME_TYPES] || 'application/octet-stream'
  );
}
