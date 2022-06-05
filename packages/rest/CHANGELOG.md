# @fuwa/rest

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
    - eg: `REST.createMessage("channelId", { content: "a" })`
