import { GatewayReceivePayload } from 'discord-api-types';
import { WebSocketManager } from '.';
export declare function message(
  manager: WebSocketManager,
  data: GatewayReceivePayload
): void;
