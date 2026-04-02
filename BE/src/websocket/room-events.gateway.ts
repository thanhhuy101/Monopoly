import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { forwardRef, Inject } from '@nestjs/common';
import { RoomsService } from '../rooms/services/rooms.service';
import { JwtService } from '../infrastructure/services/jwt.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'room-events',
})
export class RoomEventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private roomConnections = new Map<string, Set<string>>(); // roomId -> Set of socketIds
  private socketToRoom = new Map<string, string>(); // socketId -> roomId
  private socketToUser = new Map<string, string>(); // socketId -> userId
  private userConnections = new Map<string, Set<string>>(); // userId -> Set of socketIds

  constructor(
    @Inject(forwardRef(() => RoomsService))
    private readonly roomsService: RoomsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      // Extract userId from JWT token
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (token) {
        try {
          const decoded = this.jwtService.verifyToken(token);
          this.socketToUser.set(client.id, decoded.sub);
          
          // Track user connections
          if (!this.userConnections.has(decoded.sub)) {
            this.userConnections.set(decoded.sub, new Set());
          }
          this.userConnections.get(decoded.sub)!.add(client.id);
          
          console.log(`User ${decoded.sub} connected with socket ${client.id}`);
          console.log(`User ${decoded.sub} now has ${this.userConnections.get(decoded.sub)!.size} connections`);
        } catch (error) {
          console.error('Invalid JWT token:', error);
          client.disconnect();
          return;
        }
      }
    } catch (error) {
      console.error('Connection error:', error);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      const roomId = this.socketToRoom.get(client.id);
      const userId = this.socketToUser.get(client.id);
      
      if (roomId && userId) {
        // Remove socket from room connections
        const roomConnections = this.roomConnections.get(roomId);
        if (roomConnections) {
          roomConnections.delete(client.id);
          if (roomConnections.size === 0) {
            this.roomConnections.delete(roomId);
          }
        }
        
        // Remove socket from user connections
        const userSockets = this.userConnections.get(userId);
        if (userSockets) {
          userSockets.delete(client.id);
          if (userSockets.size === 0) {
            this.userConnections.delete(userId);
            
            // User has no more connections - remove from room
            console.log(`User ${userId} has no more connections, leaving room ${roomId}`);
            
            try {
              // roomsService.leaveRoom handles broadcasting room updates
              await this.roomsService.leaveRoom(roomId, userId);
            } catch (error) {
              console.error('Error auto-leaving room:', error);
            }
          } else {
            console.log(`User ${userId} still has ${userSockets.size} connections, staying in room`);
          }
        }
        
        // Clean up mappings
        this.socketToRoom.delete(client.id);
        this.socketToUser.delete(client.id);
      }
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  }

  @SubscribeMessage('room:join')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; userId: string },
  ) {
    try {
      console.log(`User ${data.userId} attempting to join room ${data.roomId}`);
      
      // Verify room exists and user is in the room
      let room;
      try {
        room = await this.roomsService.findOne(data.roomId);
      } catch (error) {
        console.log(`Room ${data.roomId} not found`);
        client.emit('error', { message: 'Room not found' });
        return;
      }
      
      const isUserInRoom = room.players.includes(data.userId) || room.creatorId === data.userId;
      
      if (!isUserInRoom) {
        console.log(`User ${data.userId} is not in room ${data.roomId}`);
        client.emit('error', { message: 'User is not in this room' });
        return;
      }

      // Add socket to room
      if (!this.roomConnections.has(data.roomId)) {
        this.roomConnections.set(data.roomId, new Set());
      }
      this.roomConnections.get(data.roomId)!.add(client.id);
      this.socketToRoom.set(client.id, data.roomId);

      // Join socket.io room for broadcasting
      client.join(data.roomId);

      console.log(`User ${data.userId} successfully joined room ${data.roomId}`);
      
      return { success: true, roomId: data.roomId };
    } catch (error) {
      console.error('Error joining room:', error);
      client.emit('error', { message: 'Failed to join room' });
    }
  }

  @SubscribeMessage('room:leave')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    try {
      const roomConnections = this.roomConnections.get(data.roomId);
      if (roomConnections) {
        roomConnections.delete(client.id);
        if (roomConnections.size === 0) {
          this.roomConnections.delete(data.roomId);
        }
      }
      
      this.socketToRoom.delete(client.id);

      // Leave socket.io room
      client.leave(data.roomId);

      // Client left room
      
      return { success: true, roomId: data.roomId };
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  }

  // Method to broadcast room updates to all clients in a room
  broadcastRoomUpdate(roomId: string, event: string, data: any) {
    this.server.to(roomId).emit(event, data);
    // Broadcasted room update
  }

  // Method to send room update to specific user
  sendRoomUpdateToUser(userId: string, event: string, data: any) {
    // Find all sockets for this user and send update
    for (const [socketId, roomId] of this.socketToRoom.entries()) {
      this.server.to(socketId).emit(event, data);
    }
  }

  // Get connected clients count for a room
  getRoomConnectionCount(roomId: string): number {
    return this.roomConnections.get(roomId)?.size || 0;
  }

  // Get connection count for a user
  getUserConnectionCount(userId: string): number {
    return this.userConnections.get(userId)?.size || 0;
  }

  // Check if user is connected to any room
  isUserConnected(userId: string): boolean {
    return this.userConnections.has(userId) && this.userConnections.get(userId)!.size > 0;
  }
}
