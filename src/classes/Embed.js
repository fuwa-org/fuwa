/**
 * A Discord API embed. Can be sent in any channel.
 * @see Channel The embed can be sent in any channel with or without a Message.
 * @see Message See above.
 * @constructor
 */
class Embed {
  /**
   * The type of this embed. Will always be `rich`
   * @type {'rich'}
   */
  type = "rich";
  /**
   * Creates a new Discord Embed.
   * @param {EmbedOptions} data Data to be injected into the embed.
   */
  constructor(data = {}) {
    Object.entries(data).map(([K, V]) => (this[K] = V));
  }
  /**
   * The title of this embed.
   * @type {string}
   */
  title = null;
  /**
   * Sets the title of the embed.
   * @param {string} title The new title of this embed.
   * @returns {Embed} Returns an embed for chaining.
   */
  setTitle(title) {
    this.title = title;
    return this;
  }
  /**
   * The description of this Embed.
   * @type {string}
   */
  description = null;
  /**
   * Sets the embed's description.
   * @param {string} description The new description of the embed.
   * @returns {Embed} returns an embed for chaining.
   */
  setDescription(description) {
    this.description = description;
    return this;
  }
  /**
   * The timestamp of the embed.
   * @type {number}
   */
  timestamp = null;
  /**
   * Sets a new timestamp for the embed.
   * @param {number | Date} [timestamp=Date.now()] The new timestamp for the embed. Defaults to `Date.now()`
   * @returns {Embed} returns an embed for chaining.
   */
  setTimestamp(timestamp = Date.now()) {
    if (timestamp instanceof Date) timestamp = timestamp;
    this.timestamp = new Date(timestamp);
    return this;
  }
  /**
   * The color of the embed.
   * @type {number}
   */
  color = null;
  /**
   *
   * @param {string | number} color
   */
  setColor(color) {
    if (
      typeof color !== "number" &&
      color.toUpperCase().replace(/[-_ ]/g, "_") in Embed.COLORS
    ) {
      this.color =
        Embed.COLORS[color.toUpperCase().replace(/[-_ ]/g, "_")] ?? this.color;
    }
    return this;
  }
  static COLORS = {
    RED: 0xff0000,
    ORANGE: 0xffa500,
    YELLOW: 0xffff00,
    GREEN: 0x008000,
    BRIGHT_GREEN: 0x7fff00,
    CYAN: 0x00ffff,
    BLUE: 0x0000ff,
    PURPLE: 0x800080,
    PINK: 0xffc0cb,
    WHITE: 0xffffff,
  };
  /**
   * The footer of the embed.
   * @type {Record<string, string | null>}
   */
  footer = null;
  /**
   *
   * @param {string} text
   * @param {string} [iconURL]
   * @param {string} [proxyIconURL]
   */
  setFooter(text, iconURL, proxyIconURL) {
    this.footer = {
      text,
      icon_url: iconURL,
      proxy_icon_url: proxyIconURL,
    };
    return this;
  }
}

module.exports = Embed;

/**
 * @typedef {{ title?: string }} EmbedOptions
 */
