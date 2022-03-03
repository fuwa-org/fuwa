import { Bitfield } from "./Bitfield";
import { MessageFlags as APIMessageFlags } from "@splatterxl/discord-api-types";

export class MessageFlags extends Bitfield {
  static Bits = APIMessageFlags;
}
