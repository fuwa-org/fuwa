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
  console.log(`${m.author.tag} said: ${m.content}`);

  if (m.content.startsWith('!ping')) {
    m.channel.createMessage({
      attachments: [
        new Fuwa.MessagePayloadAttachment({
          data: '{ "content": "pong" }',
          name: 'ping.json',
          description: 'pong',
        }),
      ],
      tts: false,
      nonce: Date.now(),
    });
    m.channel.createMessage({
      content: 'pong',
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
  } else if (m.content === 'j' && !m.author.bot) {
    m.channel.createMessage({
      content: 'j',
      tts: false,
      nonce: Date.now(),
    });
  } else {
  }
});

client.connect();

process.stdin.on('data', d => eval(d.toString()));
