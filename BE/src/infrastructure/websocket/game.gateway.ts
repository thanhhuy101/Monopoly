import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards, Inject } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import type { IGameUseCase } from '../../domain/interfaces/game.interface';
import { IGameSocketHandlers, IGameSocketEvents } from '../../domain/interfaces/game.interface';

@WebSocketGateway({
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: '/game',
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('GameGateway');

  constructor(@Inject('IGameUseCase') private readonly gameUseCase: IGameUseCase) {}

  afterInit(server: Server) {
    this.logger.log('Game WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    
    // Extract token from query params or headers
    const token = client.handshake.query.token || client.handshake.headers.authorization;
    
    if (!token) {
      client.disconnect();
      return;
    }

    // You can validate the token here if needed
    // const user = await this.authService.validateToken(token);
    // client.data.user = user;
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    
    // Handle player disconnection - update status in game
    const userId = client.data.userId;
    if (userId) {
      // Update player status to disconnected in all active games
      // This would require tracking which games the user is in
    }
  }

  @SubscribeMessage('join-game')
  async handleJoinGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    try {
      client.join(data.roomId);
      client.emit('joined-game', { roomId: data.roomId });
      
      // Send current game state to the client
      const game = await this.gameUseCase.getGameState(data.roomId);
      if (game) {
        client.emit('game:state-update', { gameState: game });
      }
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('leave-game')
  async handleLeaveGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    client.leave(data.roomId);
    client.emit('left-game', { roomId: data.roomId });
  }

  @SubscribeMessage('roll-dice')
  async handleRollDice(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { gameId: string; playerId: number },
  ) {
    try {
      const result = await this.gameUseCase.rollDice(data.gameId, data.playerId);
      
      // Emit to all players in the room
      this.server.to(data.gameId).emit('dice:rolled', {
        playerId: data.playerId,
        dice: result.dice,
      });
      
      // Update game state
      this.server.to(data.gameId).emit('game:state-update', {
        gameState: result.game.gameState,
      });
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('buy-property')
  async handleBuyProperty(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { gameId: string; playerId: number; propertyId: string },
  ) {
    try {
      const game = await this.gameUseCase.buyProperty(data.gameId, data.playerId, data.propertyId);
      
      this.server.to(data.gameId).emit('property:purchased', {
        playerId: data.playerId,
        propertyId: data.propertyId,
      });
      
      this.server.to(data.gameId).emit('game:state-update', {
        gameState: game.gameState,
      });
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('build-house')
  async handleBuildHouse(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { gameId: string; playerId: number; propertyId: string },
  ) {
    try {
      const game = await this.gameUseCase.buildHouse(data.gameId, data.playerId, data.propertyId);
      
      this.server.to(data.gameId).emit('house:built', {
        playerId: data.playerId,
        propertyId: data.propertyId,
      });
      
      this.server.to(data.gameId).emit('game:state-update', {
        gameState: game.gameState,
      });
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('mortgage-property')
  async handleMortgageProperty(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { gameId: string; playerId: number; propertyId: string },
  ) {
    try {
      const game = await this.gameUseCase.mortgageProperty(data.gameId, data.playerId, data.propertyId);
      
      this.server.to(data.gameId).emit('property:mortgaged', {
        playerId: data.playerId,
        propertyId: data.propertyId,
      });
      
      this.server.to(data.gameId).emit('game:state-update', {
        gameState: game.gameState,
      });
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('trade')
  async handleTrade(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {
      gameId: string;
      fromPlayerId: number;
      toPlayerId: number;
      properties: string[];
      amount: number;
    },
  ) {
    try {
      const game = await this.gameUseCase.trade(
        data.gameId,
        data.fromPlayerId,
        data.toPlayerId,
        data.properties,
        data.amount,
      );
      
      this.server.to(data.gameId).emit('trade:completed', {
        fromPlayerId: data.fromPlayerId,
        toPlayerId: data.toPlayerId,
        properties: data.properties,
        amount: data.amount,
      });
      
      this.server.to(data.gameId).emit('game:state-update', {
        gameState: game.gameState,
      });
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('end-turn')
  async handleEndTurn(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { gameId: string },
  ) {
    try {
      const game = await this.gameUseCase.endTurn(data.gameId);
      
      this.server.to(data.gameId).emit('turn:changed', {
        currentPlayerId: game.currentPlayer,
      });
      
      this.server.to(data.gameId).emit('game:state-update', {
        gameState: game.gameState,
      });
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  // Helper methods for emitting events from the game service
  emitGameUpdate(roomId: string, gameState: any) {
    this.server.to(roomId).emit('game:state-update', { gameState });
  }

  emitGameStarted(roomId: string) {
    this.server.to(roomId).emit('game:started', { roomId });
  }

  emitGameFinished(roomId: string, winnerId: number) {
    this.server.to(roomId).emit('game:finished', { roomId, winnerId });
  }

  emitTurnChange(roomId: string, currentPlayerId: number) {
    this.server.to(roomId).emit('turn:changed', { currentPlayerId });
  }

  emitPlayerAction(roomId: string, playerId: number, action: string, data: any) {
    this.server.to(roomId).emit('game:action', { playerId, action, data });
  }

  emitPlayerStatus(roomId: string, playerId: number, status: string) {
    this.server.to(roomId).emit('player:status', { playerId, status });
  }
}
