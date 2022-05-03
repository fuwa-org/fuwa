import { Bitfield } from './Bitfield';
import { GuildSystemChannelFlags as FLAGS } from 'discord-api-types/v10';

export class GuildSystemChannelFlags extends Bitfield {
  public static FLAGS = FLAGS as unknown as Record<string, number>;
}
