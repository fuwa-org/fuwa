import { GatewayIntentBits } from 'discord-api-types/v10';
import { Bitfield } from './Bitfield';
export declare class Intents extends Bitfield {
    static Bits: typeof GatewayIntentBits;
}
