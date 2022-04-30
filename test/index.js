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

const trends = new Map();

client.on('messageCreate', async m => {
  if (m.author.bot) return;

  client.logger.trace(
    `${m.author.username}#${m.author.discriminator}: ${m.content}`,
  );

  if (m.content.startsWith('!ping')) {
    m.reply({
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
      m.reply(
        `\`\`\`js\n${
          typeof result === 'string'
            ? result
            : require('util').inspect(result, { colors: false }).slice(0, 1990)
        }\n\`\`\``,
      );
    } catch (e) {
      m.reply(
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
        allowedRetries: 0,
      });
    }
  }

  (() => {
    if (m.content) {
      if (trends.has(m.channel.id)) {
        const [content, users] = trends.get(m.channel.id);
        if (content !== m.content) return trends.delete(m.channel.id);
        if (users.includes(m.author.id)) return;
        users.push(m.author.id);
        trends.set(m.channel.id, [content, users]);
        if (users.length === 5) {
          m.channel.createMessage(content);
          trends.delete(m.channel.id);
          return;
        }
      } else {
        trends.set(m.channel.id, [m.content, [m.author.id]]);
      }
    }
  })();
});

client.connect();

process.stdin.on('data', d => {
  try {
    console.log(eval(d.toString()));
  } catch (e) {
    console.log(e);
  }
});
