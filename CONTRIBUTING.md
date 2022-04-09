# Contributing to Fuwa

Thanks for your interest in contributing to Fuwa! 

## What we accept

These lay out, very simply, what we do and don't want to be contributed into Fuwa.

### Accepted contributions

Code changes that:

- improve consistency project-wide
- add Discord API features
- improve performance and/or code logic
- fix bugs ([Issues](https://github.com/fuwadiscord/fuwa/issues))

### Unwelcome contributions

Changes that:

- introduce extremely major breaking changes, unless they are required for a new Discord API features
- introduce self-botting APIs
- reduce performance significantly
- are extreme abstractions (see [Abstractions](#abstractions))

## Abstractions

Fuwa is designed to be as close as possible to the Discord API, while also implementing caching and other really minor abstractions.

As an example, managers control non-entity-specific actions and entities themselves implement methods that edit them. A really good example of this is `GuildMember#disableCommunication` and `GuildMemberManager#ban`.

While `GuildMemberManager` _does_ have an alias `disableCommunicationFor()`, the main function is implemented in `GuildMember` <u>because the underlying API call is</u> `PATCH /guilds/:guild_id/members/:id`.

`GuildMember`, again, has an alias, `.ban()` but _it calls_ `GuildMemberManager#ban` _because it's not entity-specific_. However, a minor astraction is allowed here for simplicity's sake, since the API call is `PUT /guilds/:guild_id/bans/:member_id`.
