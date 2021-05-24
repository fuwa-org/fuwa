import { GatewayMessageCreateDispatch } from 'discord-api-types';
import { Message } from '../structures/Message';
import { WebSocketManager } from '../ws';
export default function (
  manager: WebSocketManager,
  data: GatewayMessageCreateDispatch
): void {
  const message = new Message(manager.client, data.d);
  manager.client.emit('messageCreate', message);
}
