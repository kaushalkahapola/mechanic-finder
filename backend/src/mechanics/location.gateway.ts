import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsJwtAuthGuard } from '../auth/guards/ws-jwt-auth.guard';
import { MechanicsService } from './mechanics.service';

interface LocationUpdate {
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  timestamp: number;
}

@WebSocketGateway({
  cors: true,
  namespace: 'locations',
})
export class LocationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private connectedMechanics: Map<string, Socket> = new Map();

  constructor(private readonly mechanicsService: MechanicsService) {}

  @UseGuards(WsJwtAuthGuard)
  async handleConnection(client: Socket) {
    const userId = client.handshake.auth.userId;
    if (userId) {
      this.connectedMechanics.set(userId, client);
      client.join(`mechanic:${userId}`);
      await this.mechanicsService.updateOnlineStatus(userId, true);
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = client.handshake.auth.userId;
    if (userId) {
      this.connectedMechanics.delete(userId);
      client.leave(`mechanic:${userId}`);
      await this.mechanicsService.updateOnlineStatus(userId, false);
    }
  }

  @SubscribeMessage('updateLocation')
  @UseGuards(WsJwtAuthGuard)
  async handleLocationUpdate(client: Socket, payload: LocationUpdate) {
    const userId = client.handshake.auth.userId;
    if (!userId) return;

    // Update mechanic's location in database
    await this.mechanicsService.updateLocation(userId, {
      latitude: payload.latitude,
      longitude: payload.longitude,
      availability: true, // Assuming mechanic is available when sending location
    });

    // Broadcast location update to relevant subscribers
    this.server.to(`search:${userId}`).emit('mechanicLocation', {
      mechanicId: userId,
      ...payload,
    });
  }

  // Method to subscribe to specific mechanic's location updates
  @SubscribeMessage('subscribeMechanic')
  async handleSubscribeMechanic(client: Socket, mechanicId: string) {
    client.join(`search:${mechanicId}`);
  }

  // Method to unsubscribe from specific mechanic's location updates
  @SubscribeMessage('unsubscribeMechanic')
  async handleUnsubscribeMechanic(client: Socket, mechanicId: string) {
    client.leave(`search:${mechanicId}`);
  }
}
