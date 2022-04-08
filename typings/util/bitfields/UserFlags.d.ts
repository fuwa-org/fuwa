import { Bitfield } from './Bitfield.js';
import { UserFlags as APIUserFlags } from 'discord-api-types/v10';
export declare class UserFlags extends Bitfield {
    static Bits: typeof APIUserFlags;
}
