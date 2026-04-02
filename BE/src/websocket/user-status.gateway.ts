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
import { UsersService } from '../users/services/users.service';
import { JwtService } from '../infrastructure/services/jwt.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'user-status',
})
export class UserStatusGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>(); // userId -> socketId

  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      // Extract JWT token from handshake
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (token) {
        // Verify JWT token and get userId
        try {
          const decoded = this.jwtService.verifyToken(token);
          const userId = decoded.sub;
          
          this.connectedUsers.set(userId, client.id);
          
          // Update user online status
          await this.usersService.updateOnlineStatus(userId, true);
          
          // Broadcast to all connected users
          this.server.emit('user:status-change', {
            userId,
            isOnline: true,
            lastSeen: null,
          });
          
          console.log(`User ${userId} connected with socket ${client.id}`);
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
      const userId = this.findUserIdBySocketId(client.id);
      
      if (userId) {
        this.connectedUsers.delete(userId);
        
        // Update user offline status
        await this.usersService.updateOnlineStatus(userId, false);
        
        // Broadcast to all connected users
        this.server.emit('user:status-change', {
          userId,
          isOnline: false,
          lastSeen: new Date(),
        });
        
        console.log(`User ${userId} disconnected (socket ${client.id})`);
      }
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  }

  @SubscribeMessage('user:join')
  async handleUserJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string },
  ) {
    client.data.userId = data.userId;
    this.connectedUsers.set(data.userId, client.id);
    
    // Update online status
    await this.usersService.updateOnlineStatus(data.userId, true);
    
    // Broadcast status change
    this.server.emit('user:status-change', {
      userId: data.userId,
      isOnline: true,
      lastSeen: null,
    });
    
    return { success: true, userId: data.userId };
  }

  @SubscribeMessage('user:status')
  async handleStatusUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string; isOnline: boolean },
  ) {
    // Update status in database
    await this.usersService.updateOnlineStatus(data.userId, data.isOnline);
    
    // Broadcast to all users
    this.server.emit('user:status-change', {
      userId: data.userId,
      isOnline: data.isOnline,
      lastSeen: data.isOnline ? null : new Date(),
    });
    
    return { success: true, ...data };
  }

  // Get list of online users
  @SubscribeMessage('user:online-list')
  async handleOnlineList() {
    const onlineUsers = Array.from(this.connectedUsers.keys());
    return { onlineUsers };
  }

  private findUserIdBySocketId(socketId: string): string | undefined {
    for (const [userId, id] of this.connectedUsers.entries()) {
      if (id === socketId) {
        return userId;
      }
    }
    return undefined;
  }

  // Method to send message to specific user
  sendToUser(userId: string, event: string, data: any) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.server.to(socketId).emit(event, data);
    }
  }

  // Method to broadcast to all users
  broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }
}
