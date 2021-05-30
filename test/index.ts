import { Client, Intents, Snowflake } from '..';
import { inspect } from 'util';

const client = new Client(process.argv[2].slice(6), {
  intents: Intents.NON_PRIVILEDGED,
});
const i = (v: unknown) => inspect(v, { depth: 0, colors: true });
client.on('ready', () => {
  console.log(
    `Logged in with ${client.user.username}#${client.user.discriminator}`
  );
  console.error(inspect(client, { depth: 0, colors: true }));
});
client.on('messageCreate', async (m) => {
  console.error(i(m));
  if (m.content === 'lightbulb test') return m.reply('hi');
  else if (m.content === 'hi' && m.author.id === client.user.id)
    m.edit('hello');
  else if (m.content.startsWith('lightbulb eval ')) {
    const code = m.content.slice('lightbulb eval '.length);
    let result: unknown;
    try {
      result = await eval(code);
    } catch (e) {
      result = e;
    }
    m.reply(`\`\`\`xl\n${inspect(result, { depth: 0 })}\n\`\`\``, {
      allowedMentions: { repliedUser: false },
    });
  } else if (m.content.startsWith('lightbulb user')) {
    const user = client.users.get(
      m.content.slice('lightbulb user '.length) as Snowflake
    );
    m.reply(`Here's information about **${user.username}**:`, {
      embed: {
        description: `**${user.username}#${user.discriminator}**`,
        fields: [
          { name: 'Created at', value: user.createdAt.toLocaleString() },
        ],
        thumbnail: {
          url: user.avatar({ dynamic: true, format: 'png', size: 512 }),
        },
      },
    });
  }
});
client.connect();
