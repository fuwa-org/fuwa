#!/bin/node
/** @format */

const { DefaultClientOptions, Intents } = require('..');
const Fuwa = require('..');

const client = new Fuwa.Client(process.env.DISCORD_TOKEN, {
  logger: {
    level: 'trace',
  },
  intents: [...DefaultClientOptions.intents, Intents.Bits.MessageContent],
}).on('ready', () => {
  client.logger.info('ready');
});

client.on('messages.create', async m => {
  if (m.author.bot) return;

  if (m.content.startsWith('!ping')) {
    m.channel.createMessage({
      content: 'ping pong latency is ' + m.guild.shard.ping + 'ms',
      tts: false,
      nonce: Date.now(),
    });
  } else if (
    m.content.startsWith('!eval') &&
    m.author.id === '728342296696979526'
  ) {
    try {
      const code = m.content.substring(6);
      const result = await eval(code);
      m.channel.createMessage(
        `\`\`\`js\n${
          typeof result === 'string'
            ? result
            : require('util').inspect(result, { colors: false }).slice(0, 1990)
        }\n\`\`\``,
      );
    } catch (e) {
      m.channel.createMessage(
        `\`\`\`js\n${require('util')
          .inspect(e, { colors: false })
          .slice(0, 1990)}\n\`\`\``,
      );
    }
  }

  if (m.attachments.length > 0) {
    if (Math.random() < 0.6) {
      /** @type {Fuwa.Types.RESTPostAPIChannelMessageJSONBody} */
      const body = {
        content: 'wow so cool',
      };

      m.client.rest.channels(m.channel.id).messages.post({
        body,
      });
    }
  }
});

client.connect();

process.stdin.on('data', d => eval(d.toString()));