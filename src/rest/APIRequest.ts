import { HttpMethod } from 'undici/types/dispatcher';
import { URLSearchParams } from 'url';

export interface APIRequest {
  route: string;
  auth?: boolean;
  versioned?: boolean;
  query?: URLSearchParams | string | null;
  body?: any | null;
  files?: File[] | null;
  method?: HttpMethod;
  headers?: Record<string, string>;
  reason?: string | null;
  useRateLimits?: boolean;
  useBaseUrl?: boolean;

  allowedRetries?: number;
  retries?: number;
}

export interface File {
  key?: string;
  filename?: string;
  data: Buffer;
  contentType?: string;
}

export function resolveRequest(req: APIRequest): Required<APIRequest> {
  return {
    auth: true,
    versioned: true,
    query: null,
    body: null,
    files: null,
    method: 'GET',
    allowedRetries: 5,
    retries: 0,
    headers: {},
    reason: null,
    useRateLimits: true,
    useBaseUrl: true,
    ...req,
  };
}
