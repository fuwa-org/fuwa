const fetch = require('node-fetch');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let globalTimeout = 0;
function flattenObject(ob) {
    var toReturn = {};

    for (var i in ob) {
        if (!ob.hasOwnProperty(i)) continue;

        if ((typeof ob[i]) == 'object' && ob[i] !== null) {
            var flatObject = flattenObject(ob[i]);
            for (var x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) continue;

                toReturn[i + '.' + x] = flatObject[x];
            }
        } else {
            toReturn[i] = ob[i];
        }
    }
    return toReturn;
}
module.exports = async (method, path, opts) => {
	if (globalTimeout)
		await sleep(globalTimeout - Date.now()).then(() => (globalTimeout = 0));
	const res = await fetch.default(`https://discord.com/api/v8/${path}`, {
			method,
			headers: {
				Authorization: `Bot ${opts.client.token}`,
				'User-Agent': `DiscordBot (Wrappercord/0.0.1; Node.js/${process.version}; ${process.pid})`,
				...opts.headers
			},
			...opts.extra
		}),
		json = await res.json();
	// console.log(require('util').inspect(res, { depth: 69 }));
	console.log(require('util').inspect(json, { depth: 69 }));
	if (parseInt(res.headers.get('x-ratelimit-remaining')) <= 1)
		globalTimeout = parseInt(res.headers.get('x-ratelimit-reset'));
	if (res.ok) return json;
	else if (res.status === 429)
		throw new Error('[RATELIMIT_STATUS_HIT] 429 Status hit on endpoint.');
	else if (json.errors)
		throw new Error(
			`${res.statusText} (${res.status}):\n${Object.entries(flattenObject(json.errors))
				.map(([K, V]) => `${K}: ${V}`)
				.join('\n')}`
		);
	else
		throw new Error(
			`${res.statusText} (${res.status}): ${json.message} (${json.code})`
		);
};
