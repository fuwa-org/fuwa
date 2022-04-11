<center>
  <img src="https://avatars.githubusercontent.com/u/100430266?v=4&s=1024" />
</center>

# 不和 (fuwa)

不和 is a simple, small and easy-to-use library for use in
[Node.js](https://nodejs.org) to interact with the popular text and VoIP instant
messaging application [Discord](https://discord.com) using its
[public API](https://discord.com/developers).

**Note**: this package is currently maintained in 0ver, which means breaking
changes may occur at our discretion in compliance with SemVer.

## Installation

Node.js version 16 or higher is required for this library.

Installing with [npm](https://npmjs.com), [Yarn](https://yarnpkg.com) or any
other package manager for Node.js is simple. Simply run the following command
(adapted to your current package manager, if applicable) in your terminal and
you'll be ready to go!

```sh
# with npm
npm install --save fuwadiscord/fuwa

# with yarn
yarn add github:fuwadiscord/fuwa
```

**Note**: pin to a commit you like to avoid breaking changes

## Getting started

Fuwa is designed to be quite simple to use, and easy to transfer from other
libraries like Discord.js. A simple bot would be programmed along the lines of:

```js
import Fuwa from 'fuwa';

const client = new Client('my token', {
  intents: [
    ...Fuwa.DefaultClientOptions.intents,
    Fuwa.Intents.Bits.MessageContent,
  ],
});

client.on('messages.create', message => {
  if (message.content === 'hi, bot!') {
    return message.channel.createMessage('hello, ' + message.author.tag);
  }
});

client.connect();
```

## Optional dependencies

- **Erlpack**: For _very_ fast encoding/decoding of gateway messages. To use
  this feature, install [`erlpack`](https://npm.im/erlpack) as an npm dependency
  and pass `etf: true` to your `Client`'s options.
  - => If you have your own custom ETF decoder, you can pass that instead to
    `etf`, but make sure it implements our `Erlpack` interface.
- **Kleur**: For coloured log output. To use this feature, install
  [`kleur`](https://npm.im/kleur) as an npm dependency.

# Links

- [Website (with documentation)](https://fuwadiscord.github.io/fuwa)
- [GitHub repository](https://github.com/FuwaDiscord/fuwa)
- [Related projects](https://discord.com/developers/docs/topics/community-resources)
- [Discord server](https://discord.gg/tDG9BMz5s7)
