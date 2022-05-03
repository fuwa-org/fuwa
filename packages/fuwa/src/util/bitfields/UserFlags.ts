import { Bitfield } from './Bitfield.js';
import { UserFlags as APIUserFlags } from 'discord-api-types/v10';

export class UserFlags extends Bitfield {
  static Bits = APIUserFlags;
}
