import { HttpMethod } from 'undici/types/dispatcher';
import { URLSearchParams } from 'url';

export interface APIRequest<T = any> {
  route: string;
  auth?: boolean;
  versioned?: boolean;
  query?: URLSearchParams | string | null;
  body?: T | null;
  files?: File[] | null;
  method?: HttpMethod;
  headers?: Record<string, string>;
  reason?: string | null;
  useRateLimits?: boolean;
  useBaseUrl?: boolean;

  allowedRetries?: number;
  retries?: number;

  payloadJson?: boolean;

  // timings
  startTime?: number;
  httpStartTime?: number;
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
    files: null,
    body: null,
    method: 'GET',
    allowedRetries: 5,
    retries: 0,
    headers: {},
    reason: null,
    useRateLimits: true,
    useBaseUrl: true,
    payloadJson: false,
    startTime: -1,
    httpStartTime: -1,
    ...req,
  };
}
