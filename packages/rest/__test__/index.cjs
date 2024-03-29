/* eslint-disable @typescript-eslint/no-var-requires, no-undef */
const REST = require('../typings');
const assert = require('assert');

const manager = new REST.default(
  new REST.RESTClient(REST.DefaultDiscordOptions),
  {
    timings: true,
    logger: {
      header: '',
      debug: (message, ...args) => {
        if (!message.startsWith('[abcdef]'))
          throw new Error(`Unexpected message: ${message}`);

        console.log(message, ...args);
      },
      trace: console.log,
      kleur: null,
    },
  },
);

manager.client.setAuth(process.env.DISCORD_TOKEN);

assert.strictEqual(manager.client.getAuth(), process.env.DISCORD_TOKEN);
assert.strictEqual(manager.client.baseURL, REST.DefaultDiscordOptions.baseURL);
assert.strictEqual(
  manager.client.options.userAgent,
  REST.DefaultDiscordOptions.userAgent,
);
assert.strictEqual(manager.client.version, REST.DefaultDiscordOptions.version);

manager
  .queue('/gateway')
  .then(res => res.body.json())
  .then(json => {
    assert.deepStrictEqual(json, {
      url: 'wss://gateway.discord.gg',
    });
  });
