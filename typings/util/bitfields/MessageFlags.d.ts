import { Bitfield } from './Bitfield';
import { MessageFlags as APIMessageFlags } from '@splatterxl/discord-api-types';
export declare class MessageFlags extends Bitfield {
    static Bits: typeof APIMessageFlags;
}
