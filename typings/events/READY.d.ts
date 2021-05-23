import { GatewayReadyDispatch } from 'discord-api-types';
import { WebSocketManager } from '../ws';
export default function (
  manager: WebSocketManager,
  data: GatewayReadyDispatch
): void;
