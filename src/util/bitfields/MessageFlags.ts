import { Bitfield } from './Bitfield';
import { MessageFlags as APIMessageFlags } from 'discord-api-types/v10';

export class MessageFlags extends Bitfield {
  static Bits = APIMessageFlags;
}
