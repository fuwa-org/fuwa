import { Bitfield } from './Bitfield';
import { MessageFlags as APIMessageFlags } from 'discord-api-types/v10';
export declare class MessageFlags extends Bitfield {
    static Bits: typeof APIMessageFlags;
}
