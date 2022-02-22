import { GatewayIntentBits } from '@splatterxl/discord-api-types';
import { Bitfield } from '../util/Bitfield';

export class Intents extends Bitfield {
  /** https://discord.com/developers/docs/topics/gateway#list-of-intents */
  public static Bits = GatewayIntentBits;
}
