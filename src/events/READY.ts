import { GatewayReadyDispatch } from "discord-api-types";
import { User } from "../structures/User";
import { WebSocketManager } from "../ws";

export default function (
  manager: WebSocketManager,
  data: GatewayReadyDispatch
): void {
  manager.client.user = new User(manager.client, data.d.user);
  manager.client.emit("ready");
}
