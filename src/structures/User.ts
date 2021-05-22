import { APIUser } from "discord-api-types";
import { Client } from "../client";
import { Base } from "./Base";
import { ImageURLOptions } from "../types";
import { Snowflake } from "../util/snowflake";
import { CONSTANTS } from "../constants";
import { UserFlags } from "../util/UserFlags";

export class User extends Base {
  bot: null | boolean = null;
  id: Snowflake;
  avatarHash: string;
  email: null | string = null;
  flags: null | UserFlags = null;
  locale: null | string = null;
  system: null | boolean = null;
  username: string;
  discriminator: string;
  verified: null | boolean = null;
  mfaEnabled: null | boolean = null;
  constructor(client: Client, data: APIUser & { id: Snowflake }) {
    super(client);
    if ("bot" in data) this.bot = data.bot;
    this.avatarHash = data.avatar;
    this.id = data.id;
    if ("email" in data) this.email = data.email;
    if ("flags" in data) this.flags = new UserFlags(data.flags);
    else if ("public_flags" in data)
      this.flags = new UserFlags(data.public_flags);
    if ("locale" in data) this.locale = data.locale || null;
    if ("system" in data) this.system = data.system || null;
    this.username = data.username;
    this.discriminator = data.discriminator;
    if ("verified" in data) this.verified = data.verified || null;
    if ("mfa_enabled" in data) this.mfaEnabled = data.mfa_enabled;
  }
  avatar(
    options: ImageURLOptions = { size: 512, format: "webp", dynamic: false }
  ): string | null {
    if (this.avatarHash)
      return CONSTANTS.urls.cdn.avatar(
        this.avatarHash,
        options.dynamic && this.avatarHash.startsWith("a_")
          ? "gif"
          : options.format,
        options.size
      );
    else return null;
  }
}
