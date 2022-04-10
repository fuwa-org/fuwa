import { Client } from '../client/Client';
import { Snowflake } from '../client/ClientOptions';

export function validate(token: string) {
  const split = token.split('.');

  if (split.length !== 3) {
    throw new Error('Invalid token');
  }

  const [header, payload, signature] = split;

  if (!header || !payload || !signature) {
    throw new Error('Invalid token');
  }

  return {
    header,
    payload,
    signature,
  };
}

export function parse(token: string, client?: Client) {
  const { header, payload } = validate(token);

  const userId = Buffer.from(header, 'base64').toString('utf8');
  const timestamp = new Date(
    parseInt(Buffer.from(payload, 'base64').toString('hex'), 16) * 1000,
  );

  return new TokenInfo(token, { user: userId as Snowflake, timestamp }, client);
}

export function redactToken(token: string) {
  const { header, payload, signature } = validate(token);

  return `${header}.${payload}.${'*'.repeat(signature.length)}`;
}

export class TokenInfo {
  client?: Client;
  user: Snowflake;
  timestamp: Date;

  constructor(
    original: string,
    deconstructed: { user: Snowflake; timestamp: Date },
    client?: Client,
  ) {
    Object.defineProperties(this, {
      original: { value: original, enumerable: false },
      client: { value: client, enumerable: false },
    });
    this.user = deconstructed.user;
    this.timestamp = deconstructed.timestamp;
  }

  fetchUser() {
    return this.client!.users.fetch(this.user);
  }
}
