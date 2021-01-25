const fetch = require('node-fetch'),
	Embed = require('./Embed'),
	request = require('../rest/RequestHandler.js');
const APIMessage = require('./APIMessage');
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

module.exports = class Channel {
	constructor(data, client, channelId) {
		this.client = client;
		Object.entries(camelCase(data)).forEach(
			([K, V]) =>
				(this[`_${K}`] =
					typeof V == 'string'
						? V.match(/\d{4}\-\d{2}\-\d{2}T[\d\:]+\.\d{6}\+[\d\:]/g)
							? dateify(V)
							: V
						: V)
		);
		this.id = this._id ?? channelId;
		this.client.emit('cacheRequest', { type: 'channel', data: this });
		// Object.entries(camelCase(client.channels.cache.get(this._id) ?? ({}))).forEach(([K, V]) => this[K] = typeof V == "string" ? V.match(/\d{4}\-\d{2}\-\d{2}T[\d\:]+\.\d{6}\+[\d\:]/g) ? dateify(V): V : V);
	}
	async send(content, options) {
		return new Message(
			await request('post', `channels/${this.id}/messages`, {
				client: this.client,
				headers: { 'Content-Type': 'application/json' },
				extra: {
					body: JSON.stringify(
						APIMessage.from(content, options, this.client)
					)
				}
			}),
			this.client
		);
	}
	/**
	 * @private
	 */
	_id;
};

// fixes bug where message isn't a constructor
const Message = require('./Message');
