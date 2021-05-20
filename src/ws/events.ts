import { GatewayReceivePayload } from "discord-api-types";
import { WebSocketManager } from ".";
export function message(
  manager: WebSocketManager,
  data: GatewayReceivePayload
) {
  if (data.s) manager.lastSequence = data.s;
}
