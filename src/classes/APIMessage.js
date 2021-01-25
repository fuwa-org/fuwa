const Embed = require('./Embed');
const Message = require('./Message');

class APIMessage {
	constructor (data) { Object.entries(data).map(([K,V]) => this[K] = V) }
	/**
	 *
	 * @param {string | Embed} content
	 * @param {Record<string, unknown>} options
	 * @param {*} client
	 * @returns
	 */
	static from(content, options = {}, client) {
		const obj = {};
		if (content instanceof Embed) obj.embed = content;
		else if (options instanceof Embed) obj.embed = options;
		else if (options.embed) obj.embed = options.embed;
		else if (content instanceof APIMessage) return content;
		else if (options instanceof APIMessage) return content;
		else obj.content = content;
		if ('replyTo' in options)
			if (options.replyTo instanceof Message)
				obj.message_reference = {
					message_id: options.replyTo.id,
					channel_id: options.replyTo.channel.id,
					guild_id: options.replyTo.guild.id
				}; else if (typeof options.replyTo === "string") obj.message_reference = options.replyTo;
		return new APIMessage(obj);
	}
}
module.exports = APIMessage;
