import { GatewayHello } from 'discord-api-types';
import { WebSocketManager } from '../../ws';
export default function handleOpcode10(manager: WebSocketManager, data: GatewayHello): void;
