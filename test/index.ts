import { Client, Intents } from '..';
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
client.on('messageCreate', (m) => {
  console.error(i(m));
  if (m.content === 'lightbulb test') return m.channel.messages.create('hi');
  else if (m.content === 'hi' && m.author.id === client.user.id)
    m.edit('hello');
});
client.connect();
