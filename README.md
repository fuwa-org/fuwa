# fuwa

fuwa is a small, lightweight library for use in [Node.js] for interaction with
the popular text and VoIP instant messaging application [Discord] through its
[public bot API][discord-docs].

## installation.

While fuwa is under heavy alpha development, some components of it are publicly
released. See [installation.md] for installation details.

## getting started.

fuwa is designed for use by developers familiar with the Discord API, and does
not provide heavy abstractions like other libraries. If this isn't for you, see
the [related projects](#links).

A simple ping/pong bot using [@fuwa/ws], [@fuwa/model], [@fuwa/rest] and
[discord-api-types] would resemble the following:

```js
import { GatewayManager } from '@fuwa/ws';
import { Message } from '@fuwa/model';
import { REST } from '@fuwa/rest';
import { APIMessage } from 'discord-api-types';

const gateway = new GatewayManager('my bot token');
const rest = new REST('Bot <my token>');

gateway.on('MESSAGE_CREATE', message => {
  const msg = new Message(message);

  if (msg.content.startsWith('!ping')) {
    rest.createMessage(msg.channelID, {
      content: 'pong!',
      message_reference: {
        message_id: msg.id,
      },
    });
  }
});
```

## links.

- [documentation.](https://fuwa-org.github.io/fuwa)
- [repository.](https://github.com/fuwa-org/fuwa)
- [related projects.](https://discord.com/developers/docs/topics/community-resources)
- [discord server.](https://discord.gg/tDG9BMz5s7)

[node.js]: https://nodejs.org
[discord]: https://discord.com
[discord-docs]: https://discord.com/developers/docs
[installation.md]: ./doc/installation.md
[@fuwa/ws]: ./packages/ws/
[@fuwa/model]: ./packages/model/
[@fuwa/rest]: ./packages/rest/
[discord-api-types]: https://github.com/discordjs/discord-api-types
