import { GatewayIntentBits } from '@splatterxl/discord-api-types/v10';
import { Bitfield } from '../util/Bitfield';
export declare class Intents extends Bitfield {
    static Bits: typeof GatewayIntentBits;
}
