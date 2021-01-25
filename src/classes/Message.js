let camelCase = (obj = {}) => {
	if (obj === null) return obj;
	Object.entries(obj).forEach(([K, V]) => {
		delete obj[K];
		obj[K.replace(/_(\w)/g, (_, v) => v.toUpperCase())] =
			typeof V !== 'object' ? V : camelCase(V);
	});
	return obj;
};

let dateify = (v) => new Date(v);

module.exports = class Message {
	/**
	 *
	 * @param {Record<string, unknown>} data
	 * @param {Client} client
	 */
	constructor(data, client) {
		Object.entries(camelCase(data)).forEach(
			([K, V]) =>
				(this[`${K}`] =
					typeof V == 'string'
						? V.match(/\d{4}\-\d{2}\-\d{2}T[\d\:]+\.\d{6}\+[\d\:]/g)
							? dateify(V)
							: V
						: V)
		);
		this.channel = new Channel(this.channel, client, this.channelId);
		delete this.channelId;
		this.embeds = this.embeds?.map((v) => new Embed(v));
		this.client = client;
		this.guild = new Guild(
			this.client.guilds.get(this.guildId),
			this.client
		);
	}
	embeds = [];
	/**
	 * @private
	 */
	channelId;
	/**
	 * @private
	 */
	guildId;
	/**
	 * @type {Snowflake}
	 */
	id;
	get reply() {
		return this.channel.send;
	}
	/**
	 * @type {Guild}
	 */
	guild;
};

const Channel = require('./Channel');
const Client = require('./Client');
const Embed = require('./Embed');
const Guild = require('./Guild');
