import { GatewayIntentBits } from '@splatterxl/discord-api-types/v10';
import { Bitfield } from '../util/Bitfield';

export class Intents extends Bitfield {
  /** https://discord.com/developers/docs/topics/gateway#list-of-intents */
  public static Bits = GatewayIntentBits;
}
