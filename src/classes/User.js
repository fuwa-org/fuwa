module.exports = class {
  constructor (data) {
    Object.entries(data).forEach(([K, V]) => this[K] = V);
    this.tag = `${this.username}#${this.discriminator}`;
  }
  getAvatarURL (opts = {}) {
    return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.${opts?.dynamic && this.avatar.startsWith("a_") ? ".gif" : (opts?.extension ?? "webp")}`
  }
}
