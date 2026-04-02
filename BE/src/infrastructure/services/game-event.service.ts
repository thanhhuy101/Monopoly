import { Injectable } from '@nestjs/common';
import type { IGameEventService } from '../../domain/interfaces/game.interface';

@Injectable()
export class GameEventService implements IGameEventService {
  private eventEmitters: Map<string, any> = new Map();

  constructor() {}

  setEventEmitter(roomId: string, emitter: any) {
    this.eventEmitters.set(roomId, emitter);
  }

  removeEventEmitter(roomId: string) {
    this.eventEmitters.delete(roomId);
  }

  emitGameUpdate(roomId: string, gameState: any): void {
    const emitter = this.eventEmitters.get(roomId);
    if (emitter) {
      emitter.to(roomId).emit('game:state-update', { gameState });
    }
  }

  emitPlayerAction(roomId: string, playerId: number, action: string, data: any): void {
    const emitter = this.eventEmitters.get(roomId);
    if (emitter) {
      emitter.to(roomId).emit('game:action', { playerId, action, data });
    }
  }

  emitTurnChange(roomId: string, currentPlayerId: number): void {
    const emitter = this.eventEmitters.get(roomId);
    if (emitter) {
      emitter.to(roomId).emit('turn:changed', { currentPlayerId });
    }
  }

  emitGameStarted(roomId: string): void {
    const emitter = this.eventEmitters.get(roomId);
    if (emitter) {
      emitter.to(roomId).emit('game:started', { roomId });
    }
  }

  emitGameFinished(roomId: string, winnerId: number): void {
    const emitter = this.eventEmitters.get(roomId);
    if (emitter) {
      emitter.to(roomId).emit('game:finished', { roomId, winnerId });
    }
  }

  emitPlayerStatus(roomId: string, playerId: number, status: string): void {
    const emitter = this.eventEmitters.get(roomId);
    if (emitter) {
      emitter.to(roomId).emit('player:status', { playerId, status });
    }
  }
}
