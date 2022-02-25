import { Bitfield } from './Bitfield.js';
import { UserFlags as APIUserFlags } from '@splatterxl/discord-api-types';

export class UserFlags extends Bitfield {
  static Bits = APIUserFlags;
}
