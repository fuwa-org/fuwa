# @fuwa/rest

## 0.4.0

### Major Changes

- changed certain endpoints from using function arguments for the JSON body to an object

```ts
import { REST } from '@fuwa/rest/dist';

const client = new REST()

await client.executeWebhook("webhookId", "token", "")
```

- renamed some endpoint methods to their equivalent in the Discord API docs
- moved from having `reason` and `with_*` options as their own arguments to having them inside an extended
  version of `RequestOptions`


### Minor Changes

- add options to all `RESTManager` methods, providing access to options like whether to use auth, rate limits, etc.


## 0.3.0

### Minor Changes

- add REST entrypoint class

Similar to [ottercord](https://github.com/Commandtechno/ottercord) but all
  manual.

Its core function is to provide an easier method of interacting directly with
  the API instead of using the main package and implementing the extra HTTP
  boilerplate yourself.

- a new class, `REST`, which provides an almost [`@discordjs/rest`]-like feel
  has been added
- easy methods and typings for documented routes have been added to the above
  class 

```ts
client.createMessage("channelId", { content: "test" })
```
