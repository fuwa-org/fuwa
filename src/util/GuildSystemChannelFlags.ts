import { Bitfield } from "./Bitfield";
import { GuildSystemChannelFlags as FLAGS } from "@splatterxl/discord-api-types";

export class GuildSystemChannelFlags extends Bitfield {
  public static FLAGS = FLAGS as unknown as Record<string, number>;
}
