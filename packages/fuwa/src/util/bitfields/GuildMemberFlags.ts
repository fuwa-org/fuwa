import { Bitfield } from './Bitfield.js';

export class GuildMemberFlags extends Bitfield {
  static Bits = {
    /** Whether the member has left and rejoined the guild */
    DidRejoin: 1 << 0,
  };
}
