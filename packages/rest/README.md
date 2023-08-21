# @fuwa/rest

A minimal, yet feature-complete, client for [Discord](https://discord.com)'s
public [REST API](https://discord.com/developers/docs). Uses undici internally.

# Installation

```shell
# using yarn
$ yarn add @fuwa/rest
# or pnpm
$ pnpm add @fuwa/rest
# or even npm
$ npm install --save @fuwa/rest
```

# Usage

```js
import { REST } from '@fuwa/rest';

const client = new REST("my_token");

await client.patch("/users/@me", {
  body: {
    username: "fuwa_l0v3r"
  },
});

// want it simpler? here you go:
await client.editCurrentUser({
  username: "fuwa_l0v3r_shorthand"
});
```

# Documentation

All endpoints under `REST` are represented by their name in the [Discord Developer Docs](https://discord.com/developers/docs).

Documentation is planned and on the roadmap. Check back here later.

# Links

- [source code](https://github.com/fuwa-org/fuwa)
- [npm package](https://npmjs.com/@fuwa/rest)
