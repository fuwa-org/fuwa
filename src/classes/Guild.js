const Client = require('./Client');

let camelCase = (obj = {}) => {
	if (obj === null) return obj;
	Object.entries(obj).forEach(([K, V]) => {
		delete obj[K];
		obj[K.replace(/_(\w)/g, (_, v) => v.toUpperCase())] =
			typeof V !== 'object' ? V : camelCase(V);
	});
	return obj;
};
const dateify = (d) => new Date(d);

class Guild {
	/**
	 *
	 * @param {Record<string, unknown> & {owner_id: Snowflake}} data
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

		this.owner = client.users.get(this.ownerID);

	}
	/**
	 * @type {?Snowflake}
	 */
	ownerID;
	/**
	 * @type {?Record<string, unknown>}
	 */
	owner;
	/**
	 * @type {Snowflake}
	 */
	id;
}

module.exports = Guild;
