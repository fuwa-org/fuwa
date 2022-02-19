import { Intents } from '../ws/intents';
import fs from 'fs';

const pkg = JSON.parse(
  fs.readFileSync(__dirname + '/../../package.json', 'utf-8')
);

/** Options for {@link Client}s. For default values see {@link DefaultClientOptions} */
export interface ClientOptions {
  /**
   * The [Gateway Intents](https://discord.com/developers/docs/topics/gateway#list-of-intents) to use for this client.
   * @default {@link Intents.DEFAULT}
   */
  intents?: ClientOptionsIntents;
  /**
   * The API version to use across the REST and WebSocket servers.
   * @default 9
   */
  apiVersion?: number;
  /**
   * Base URL for connecting to the Discord REST API. **DO NOT SPECIFY THE API VERSION IN THIS**
   * @default https://discord.com/api
   */
  httpBaseUrl?: string;
  httpUserAgent?: string;
}

export type ClientOptionsIntents = number | Intents | (number | Intents)[];

export function resolveIntents(intents: ClientOptionsIntents): Intents {
  if (intents instanceof Number) return new Intents(intents as number);
  if (intents instanceof Intents) return intents;
  if (Array.isArray(intents))
    return new Intents(
      intents.reduce(
        (prev: number, next) => prev + <number>((<Intents>next).bits ?? next),
        0
      ) as number
    );
  throw new TypeError(
    'Client intents must be a number, an array of numbers or Intents, or an Intents instance.'
  );
}

export const DefaultClientOptions: ClientOptions = {
  intents: Intents.DEFAULT,
  apiVersion: 10,
  httpBaseUrl: 'https://discord.com/api',
  httpUserAgent: `DiscordBot (${pkg.homepage}; ${pkg.version}) Node.js/${process.version}`,
};
