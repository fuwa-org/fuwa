import { GatewayHello } from "discord-api-types";
import { WebSocketManager } from "../../ws";

export default function handleOpcode10(
  manager: WebSocketManager,
  data: GatewayHello
): void {
  manager.client.timeouts.push(
    setTimeout(
      () => manager.socket.send(JSON.stringify({ op: 1, d: manager.seq() })),
      data.d.heartbeat_interval * Math.random()
    )
  );
  manager.client.intervals.push(
    setInterval(
      () => manager.socket.send(JSON.stringify({ op: 1, d: manager.seq() })),
      data.d.heartbeat_interval
    )
  );
}
