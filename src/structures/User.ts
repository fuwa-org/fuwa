import { APIUser } from "discord-api-types";
import { Client } from "../client";
import { Base } from "./Base";
import { ImageURLOptions } from "../types";
import { CONSTANTS } from "../constants";

export class User extends Base {
  bot?: boolean;
  avatarHash: string;
  constructor(client: Client, data: APIUser) {
    super(client);
    this.bot = data.bot;
    this.avatarHash = data.avatar;
  }
  avatar(
    options: ImageURLOptions = { size: 512, format: "webp", dynamic: false }
  ): string {
    return CONSTANTS.urls.cdn.avatar(
      this.avatarHash,
      options.dynamic && this.avatarHash.startsWith("a_")
        ? "gif"
        : options.format,
      options.size
    );
  }
}
