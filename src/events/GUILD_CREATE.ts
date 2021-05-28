import { GatewayGuildCreateDispatch } from 'discord-api-types';
import { Channel } from '../structures/Channel';
import { Guild } from '../structures/Guild';
import { User } from '../structures/User';
import { WebSocketManager } from '../ws';

export default function (
  manager: WebSocketManager,
  data: GatewayGuildCreateDispatch
): void {
  const uncached = manager.client.guilds.filter(
    (v) => (v as unknown as { uncached: true }).uncached
  );
  manager.client.guilds.set(data.d.id, new Guild(manager.client, data.d));
  let ready = false;
  if (uncached.size && uncached.size === 1) {
    ready = true;
  } else if (!uncached) {
    manager.client.emit('guildCreate', data.d);
  }
  if (ready) manager.client.emit('ready');
  for (const { user } of data.d.members) {
    if (manager.client.users.has(user.id)) continue;
    else {
      manager.client.users.set(user.id, new User(manager.client, user));
    }
  }
  for (const chan of data.d.channels || []) {
    manager.client.channels.set(chan.id, Channel.from(manager.client, chan));
  }
}
