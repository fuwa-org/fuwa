import { Bitfield } from './Bitfield.js';
import { UserFlags as APIUserFlags } from '@splatterxl/discord-api-types';
export declare class UserFlags extends Bitfield {
    static Bits: typeof APIUserFlags;
}
