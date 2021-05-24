import {
  APIUnavailableGuild,
  APIUser,
  GatewayReadyDispatch,
} from 'discord-api-types';
import { User } from '../structures/User';
import { Snowflake } from '../util/snowflake';
import { WebSocketManager } from '../ws';

export default function (
  manager: WebSocketManager,
  data: GatewayReadyDispatch
): void {
  manager.client.user = new User(
    manager.client,
    data.d.user as APIUser & { id: Snowflake }
  );
  for (const guild of data.d.guilds) {
    manager.client.guilds.set(guild.id, {
      unavailable: true,
      id: guild.id,
      uncached: true,
    } as APIUnavailableGuild);
  }
  manager.gatewayVersion = data.d.v;
  manager.session = data.d.session_id;
  manager.shardId = data.d.shard?.[0] || 0;
  manager.client.timeouts.push(
    setTimeout(() => {
      if (
        manager.client.guilds.some((v) => (v as { uncached: boolean }).uncached)
      ) {
        console.error('Client did not recieve guilds in time.');
        manager.client.destroy();
      }
    }, 1000 * 60 * 30 /* 30 seconds */)
  );
  manager.client.users.set(
    manager.client.user!.id,
    manager.client.user as User
  );
}
