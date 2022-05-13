import { File } from './APIRequest.js';

export function createDataURL(file: File) {
  return `data:${
    file.contentType ?? 'application/octet-stream'
  };base64,${file.data.toString('base64')}`;
}
