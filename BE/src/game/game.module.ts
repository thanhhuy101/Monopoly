import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Schema } from 'mongoose';
import { GameController } from './game.controller';
import { GameUseCase, GameService } from '../application/usecases/game.usecase';
import { GameRepository } from '../infrastructure/repositories/game.repository';
import { GameEventService } from '../infrastructure/services/game-event.service';
import { GameGateway } from '../infrastructure/websocket/game.gateway';
import type { IGameRepository, IGameService, IGameUseCase, IGameEventService } from '../domain/interfaces/game.interface';
import { Game, GameSession, GameHistory } from '../domain/entities/game.entity';
import { BankruptcyRecordSchema } from '../schemas/bankruptcy-record.schema';
import { SpectatorSessionSchema } from '../schemas/spectator-session.schema';
import { TransactionHistorySchema } from '../schemas/transaction-history.schema';
import { GameSessionSchema } from '../schemas/game-session.schema';

// MongoDB Schemas
const gameSchema = new Schema({
  id: { type: String, required: true, unique: true },
  roomId: { type: String, required: true, index: true },
  players: [{
    id: { type: Number, required: true },
    uid: { type: String, required: true },
    username: { type: String, required: true },
    emoji: { type: String, required: true },
    money: { type: Number, required: true },
    position: { type: Number, required: true },
    properties: [{ type: String }],
    jailStatus: {
      inJail: { type: Boolean, default: false },
      turns: { type: Number, default: 0 }
    },
    bankrupt: { type: Boolean, default: false },
    isCurrentTurn: { type: Boolean, default: false },
    lastAction: { type: String }
  }],
  currentPlayer: { type: Number, required: true },
  phase: { type: String, enum: ['waiting', 'playing', 'finished'], default: 'waiting' },
  dice: [{ type: Number }],
  board: {
    properties: { type: Map, of: {
      ownerId: String,
      houses: { type: Number, default: 0 },
      isMortgaged: { type: Boolean, default: false }
    }},
    houses: { type: Map, of: Number },
    mortgages: { type: Map, of: Boolean }
  },
  log: [{
    timestamp: { type: Date, default: Date.now },
    message: { type: String, required: true },
    playerId: Number,
    type: { type: String, enum: ['action', 'system', 'trade', 'property'], default: 'action' }
  }],
  settings: {
    turnTimeLimit: { type: Number, required: true },
    autoRoll: { type: Boolean, default: false },
    startingMoney: { type: Number, required: true }
  },
  createdAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
  winner: { type: Number }
}, { timestamps: true });

const gameSessionSchema = new Schema({
  roomId: { type: String, required: true, unique: true, index: true },
  gameState: {
    id: { type: String, required: true },
    roomId: { type: String, required: true },
    players: [{
      id: { type: Number, required: true },
      uid: { type: String, required: true },
      username: { type: String, required: true },
      emoji: { type: String, required: true },
      money: { type: Number, required: true },
      position: { type: Number, required: true },
      properties: [{ type: String }],
      jailStatus: {
        inJail: { type: Boolean, default: false },
        turns: { type: Number, default: 0 }
      },
      bankrupt: { type: Boolean, default: false },
      isCurrentTurn: { type: Boolean, default: false },
      lastAction: { type: String }
    }],
    currentPlayer: { type: Number, required: true },
    phase: { type: String, enum: ['waiting', 'playing', 'finished'], default: 'waiting' },
    dice: [{ type: Number }],
    board: {
      properties: { type: Map, of: {
        ownerId: String,
        houses: { type: Number, default: 0 },
        isMortgaged: { type: Boolean, default: false }
      }},
      houses: { type: Map, of: Number },
      mortgages: { type: Map, of: Boolean }
    },
    log: [{
      timestamp: { type: Date, default: Date.now },
      message: { type: String, required: true },
      playerId: Number,
      type: { type: String, enum: ['action', 'system', 'trade', 'property'], default: 'action' }
    }],
    settings: {
      turnTimeLimit: { type: Number, required: true },
      autoRoll: { type: Boolean, default: false },
      startingMoney: { type: Number, required: true }
    },
    createdAt: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
    winner: { type: Number }
  },
  players: [{
    userId: { type: String, required: true },
    status: { type: String, enum: ['online', 'offline', 'disconnected'], default: 'online' },
    lastSeen: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const gameHistorySchema = new Schema({
  roomId: { type: String, required: true, index: true },
  sessionId: { type: String, required: true },
  players: [{
    uid: { type: String, required: true },
    finalPosition: { type: Number, required: true },
    finalMoney: { type: Number, required: true },
    propertiesOwned: [{ type: String }],
    isWinner: { type: Boolean, default: false }
  }],
  gameData: {
    duration: { type: Number, required: true },
    totalTurns: { type: Number, required: true },
    finalBoardState: { type: Map, of: Object }
  },
  playedAt: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: 'Game', schema: gameSchema },
      { name: 'GameSession', schema: gameSessionSchema },
      { name: 'GameHistory', schema: gameHistorySchema },
      { name: 'BankruptcyRecord', schema: BankruptcyRecordSchema },
      { name: 'SpectatorSession', schema: SpectatorSessionSchema },
      { name: 'TransactionHistory', schema: TransactionHistorySchema },
      { name: 'GameSessionRecord', schema: GameSessionSchema },
    ]),
  ],
  controllers: [GameController],
  providers: [
    // Repository
    GameRepository,
    { provide: 'IGameRepository', useExisting: GameRepository },
    
    // Services
    GameEventService,
    { provide: 'IGameEventService', useExisting: GameEventService },
    
    // Use Cases
    GameUseCase,
    { provide: 'IGameUseCase', useExisting: GameUseCase },
    GameService,
    { provide: 'IGameService', useExisting: GameService },
    
    // Gateway
    GameGateway,
  ],
  exports: [
    // Repository
    { provide: 'IGameRepository', useExisting: GameRepository },
    
    // Services
    { provide: 'IGameService', useExisting: GameService },
    { provide: 'IGameEventService', useExisting: GameEventService },
    
    // Use Cases
    { provide: 'IGameUseCase', useExisting: GameUseCase },
  ],
})
export class GameModule {}
