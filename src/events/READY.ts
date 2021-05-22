import { APIUser, GatewayReadyDispatch } from "discord-api-types";
import { User } from "../structures/User";
import { Snowflake } from "../util/snowflake";
import { WebSocketManager } from "../ws";

export default function (
  manager: WebSocketManager,
  data: GatewayReadyDispatch
): void {
  manager.client.user = new User(
    manager.client,
    data.d.user as APIUser & { id: Snowflake }
  );
  manager.client.emit("ready");
}
