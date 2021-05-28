import { GatewayMessageCreateDispatch } from 'discord-api-types';
import { Message } from '../structures/Message';
import { TextBasedChannel } from '../structures/TextBasedChannel';
import { WebSocketManager } from '../ws';
export default function (
  manager: WebSocketManager,
  data: GatewayMessageCreateDispatch
): void {
  const message = new Message(manager.client, data.d);
  const chan = manager.client.channels.get(
    data.d.channel_id
  ) as TextBasedChannel;
  chan.messages.add(message);
  manager.client.channels.set(chan.id, chan);
  manager.client.emit('messageCreate', message);
}
