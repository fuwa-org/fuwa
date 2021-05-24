const Wrappercord = require('..');

const client = new Wrappercord.Client(process.argv[2], {
  intents: Wrappercord.Intents.ALL,
});

client
  .on('ready', () =>
    console.log(
      `Logged in with ${client.user.username}#${client.user.discriminator}`,
      client
    )
  )
  .on('messageCreate', (message) => {
    console.log(message);
  })
  .on('debug', console.log);

client.connect();
