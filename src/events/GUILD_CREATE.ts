import { GatewayGuildCreateDispatch } from 'discord-api-types';
import { WebSocketManager } from '../ws';

export default function (
  manager: WebSocketManager,
  data: GatewayGuildCreateDispatch
): void {
  manager.client.guilds.set(data.d.id, data.d);
  if (
    !manager.client.guilds.some((v) => (v as { uncached: boolean }).uncached)
  ) {
    manager.client.emit('debug', 'Client has recieved all its guilds.');
    manager.client.emit('ready');
  }
}
