import {
  GatewayDispatchEvents,
  GatewayDispatchPayload,
} from 'discord-api-types/v10';
import { ExtendedUser } from '../structures/ExtendedUser';
import { Guild } from '../structures/Guild';
import { Intents } from '../util/bitfields/Intents';
import { GatewayManager } from './GatewayManager';
import { GatewayShard, ShardState } from './GatewayShard';

export function handleDispatch(
  manager: GatewayManager,
  data: GatewayDispatchPayload,
  shard: GatewayShard,
) {
  switch (data.t) {
    case GatewayDispatchEvents.Ready: {
      shard.session = data.d.session_id;
      shard._awaitedGuilds = data.d.guilds.map(g => g.id);

      const user = new ExtendedUser(shard.client, data.d.user);

      shard.client.user = user;
      shard.client.users.add(user);

      // data.d.application

      shard.debug(`ready with ${data.d.guilds.length} guilds to sync`);

      if ((shard.client.options.intents as Intents).has(Intents.Bits.Guilds)) {
        shard.setTimeout(() => {
          if (shard._awaitedGuilds.length) {
            shard.debug(
              `shard ${shard.id} has ${shard._awaitedGuilds.length} guilds left to sync after 20s`,
            );
            shard.ready();
          }
        }, 20e3);
      } else {
        shard.debug(
          `shard ${shard.id} has no guilds to receive, marking as available`,
        );
        shard.ready();
      }

      break;
    }
    case GatewayDispatchEvents.Resumed: {
      shard.ready();
      break;
    }
    case GatewayDispatchEvents.GuildCreate: {
      const guild = new Guild(shard.client)._deserialise(data.d);
      shard.client.guilds.add(guild);

      if (shard._awaitedGuilds?.includes(guild.id)) {
        shard._awaitedGuilds.splice(shard._awaitedGuilds.indexOf(guild.id), 1);
        if (shard._awaitedGuilds.length === 0) {
          shard.debug(`shard ${shard.id} has no guilds left to sync`);
          shard.ready();
        }
      } else {
        manager.event('guildCreate', guild);
      }

      break;
    }
    case GatewayDispatchEvents.GuildUpdate: {
      const guild = shard.client.guilds.get(data.d.id);

      if (!guild) {
        shard.warn(
          `received guild update for ${data.d.id} but it doesn't exist in cache; ignoring`,
        );
        break;
      }

      guild._deserialise(data.d);

      shard.client.guilds.update(guild);
      break;
    }
    case GatewayDispatchEvents.GuildDelete: {
      shard.client.guilds.delete(data.d.id);
      break;
    }

    default: {
      shard.warn(`unhandled dispatch event ${data.t}`);
      shard.trace(data.t, data.d);
    }
  }
}
