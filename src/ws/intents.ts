import { Bitfield } from "../util/Bitfield";

export class Intents extends Bitfield {
  /** https://discord.com/developers/docs/topics/gateway#list-of-intents */
  public static FLAGS = {
    /** **Warning**: if this intent is disabled, some features may stop working unexpectedly. */ 
    GUILDS: 1 << 0,
    /** Privileged. */
    GUILD_MEMBERS: 1 << 1,
    GUILD_BANS: 1 << 2, 
    GUILD_EMOJIS: 1 << 3,
    GUILD_INTEGRATIONS: 1 << 4,
    GUILD_WEBHOOKS: 1 << 5,
    GUILD_INVITES: 1 << 6,
    GUILD_VOICE_STATES: 1 << 7,
    /** Privileged. */
    GUILD_PRESENCES: 1 << 8,
    GUILD_MESSAGES: 1 << 9,
    GUILD_MESSAGE_REACTIONS: 1 << 10,
    GUILD_MESSAGE_TYPING: 1 << 11,
    DIRECT_MESSAGES: 1 << 12,
    DIRECT_MESSAGE_REACTIONS: 1 << 13,
    DIRECT_MESSAGE_TYPING: 1 << 14, 
    /** This is privileged and required to view message content and embed values. */
    GUILD_MESSAGE_CONTENT: 1 << 15,
  }

  public static get ALL() {
    return Object.values(this.FLAGS).reduce((a, b) => a + b, 0);
  }
  /** Unprivileged gateway intents. */
  public static get UNPRIVILEGED() {
    return Object.entries(this.FLAGS).reduce((a: number, [k, b]) => a + (!["GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_PRESENCES"].includes(k) ? b : 0), 0)
  }
  /** 
   * Privileged gateway intents.
   *
   * These need to be allowed in the [developer portal](https://discord.com/developers/application) and if your bot is verified or in 100 servers, must be requested from Discord Support. 
   */
  public static PRIVILEGED = Intents.FLAGS.GUILD_MEMBERS + Intents.FLAGS.GUILD_PRESENCES + Intents.FLAGS.GUILD_MESSAGES;

  /** Default intents, in an {@link Array} for ease of use in development.
   *
   * @example 
   * new Client("my token", {
   *   intents: [
   *     ...Intents.DEFAULT,
   *     Intents.FLAGS.GUILD_PRESENCES,
   *   ]
   * });
   */
  public static DEFAULT = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS]
}
