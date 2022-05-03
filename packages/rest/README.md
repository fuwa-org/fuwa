# @fuwa/rest

A minimal, yet feature-complete, client for [Discord](https://discord.com)'s
public [REST API](https://discord.com/developers/docs). Uses undici.

Although the project is designed for Discord, it can be used for many types of
RESTful APIs.

# installation.

```sh
yarn add @fuwa/rest
npm install --save @fuwa/rest
```

# usage.

```js
import RESTManager, { RESTClient, DefaultDiscordOptions } from '@fuwa/rest';

const REST = new RESTManager(
  new RESTClient({
    ...DefaultDiscordOptions,
    auth: 'Bot <token>',
  }),
);

REST.queue({
  route: '/abc/def',
  method: 'PATCH', // needs to be uppercase!
  body: {
    foo: 'bar',
  },
})
  // undici's ResponseData is returned
  .then(d => d.body.json());
```

# documentation.

Documentation is planned. Watch this space!

# links.

- [source.](https://github.com/fuwa-org/fuwa)
