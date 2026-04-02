import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { IGameRepository } from '../../domain/interfaces/game.interface';
import { Game, GameSession, GameHistory } from '../../domain/entities/game.entity';
import { BankruptcyRecord } from '../../schemas/bankruptcy-record.schema';
import { SpectatorSession } from '../../schemas/spectator-session.schema';
import { TransactionHistory } from '../../schemas/transaction-history.schema';

@Injectable()
export class GameRepository implements IGameRepository {
  constructor(
    @InjectModel('Game') private readonly gameModel: Model<Game>,
    @InjectModel('GameSession') private readonly gameSessionModel: Model<GameSession>,
    @InjectModel('GameHistory') private readonly gameHistoryModel: Model<GameHistory>,
    @InjectModel('BankruptcyRecord') private readonly bankruptcyRecordModel: Model<BankruptcyRecord>,
    @InjectModel('SpectatorSession') private readonly spectatorSessionModel: Model<SpectatorSession>,
    @InjectModel('TransactionHistory') private readonly transactionHistoryModel: Model<TransactionHistory>,
  ) {}

  async createGame(game: Game): Promise<Game> {
    const newGame = new this.gameModel(game);
    return newGame.save();
  }

  async getGameById(gameId: string): Promise<Game | null> {
    return this.gameModel.findById(gameId).exec();
  }

  async getGameByRoomId(roomId: string): Promise<Game | null> {
    return this.gameModel.findOne({ roomId }).exec();
  }

  async updateGame(game: Game): Promise<Game> {
    const result = await this.gameModel.findByIdAndUpdate(game.id, game, { new: true }).exec();
    if (!result) {
      throw new Error(`Game with id ${game.id} not found`);
    }
    return result;
  }

  async deleteGame(gameId: string): Promise<boolean> {
    const result = await this.gameModel.findByIdAndDelete(gameId).exec();
    return !!result;
  }

  async saveGameSession(session: GameSession): Promise<GameSession> {
    const newSession = new this.gameSessionModel(session);
    return newSession.save();
  }

  async getGameSession(roomId: string): Promise<GameSession | null> {
    return this.gameSessionModel.findOne({ roomId }).exec();
  }

  async updateGameSession(session: GameSession): Promise<GameSession> {
    const result = await this.gameSessionModel.findByIdAndUpdate(session._id, session, { new: true }).exec();
    if (!result) {
      throw new Error(`Game session with id ${session._id} not found`);
    }
    return result;
  }

  async saveGameHistory(history: GameHistory): Promise<GameHistory> {
    const newHistory = new this.gameHistoryModel(history);
    return newHistory.save();
  }

  async getGameHistoryByRoomId(roomId: string): Promise<GameHistory[]> {
    return this.gameHistoryModel.find({ roomId }).sort({ playedAt: -1 }).exec();
  }

  async getGameHistoryByUserId(userId: string): Promise<GameHistory[]> {
    return this.gameHistoryModel.find({ 'players.uid': userId }).sort({ playedAt: -1 }).exec();
  }

  // New methods for bankruptcy and spectator features
  async createBankruptcyRecord(record: any): Promise<any> {
    const newRecord = new this.bankruptcyRecordModel(record);
    return newRecord.save();
  }

  async getBankruptcyRecords(gameId: string): Promise<any[]> {
    return this.bankruptcyRecordModel.find({ gameId }).sort({ triggeredAt: -1 }).exec();
  }

  async getBankruptcyRecordsByPlayer(playerId: number): Promise<any[]> {
    return this.bankruptcyRecordModel.find({ playerId }).sort({ triggeredAt: -1 }).exec();
  }

  async createSpectatorSession(spectator: any): Promise<any> {
    const newSpectator = new this.spectatorSessionModel(spectator);
    return newSpectator.save();
  }

  async getSpectatorSessions(gameId: string): Promise<any[]> {
    return this.spectatorSessionModel.find({ gameId, isActive: true }).sort({ joinedAt: -1 }).exec();
  }

  async getSpectatorByToken(token: string): Promise<any | null> {
    return this.spectatorSessionModel.findOne({ token, isActive: true }).exec();
  }

  async updateSpectatorSession(spectator: any): Promise<any> {
    const result = await this.spectatorSessionModel.findByIdAndUpdate(spectator._id, spectator, { new: true }).exec();
    if (!result) {
      throw new Error(`Spectator session with id ${spectator._id} not found`);
    }
    return result;
  }

  async removeSpectatorSession(token: string): Promise<boolean> {
    const result = await this.spectatorSessionModel.findOneAndUpdate(
      { token },
      { isActive: false, lastActive: new Date() }
    ).exec();
    return !!result;
  }

  async createTransactionRecord(transaction: any): Promise<any> {
    const newTransaction = new this.transactionHistoryModel(transaction);
    return newTransaction.save();
  }

  async getTransactionHistory(
    gameId: string,
    playerId?: number,
    type?: string,
    limit?: number,
    offset?: number
  ): Promise<{ transactions: any[]; total: number; hasMore: boolean }> {
    const filter: any = { gameId };
    if (playerId) filter.playerId = playerId;
    if (type) filter.type = type;

    const total = await this.transactionHistoryModel.countDocuments(filter);
    const transactions = await this.transactionHistoryModel
      .find(filter)
      .sort({ timestamp: -1 })
      .limit(limit || 50)
      .skip(offset || 0)
      .exec();

    const hasMore = (offset || 0) + (limit || 50) < total;

    return { transactions, total, hasMore };
  }

  async getLiquidationHistory(gameId: string, playerId: number): Promise<{ liquidations: any[]; totalRecovered: number; debtRemaining: number }> {
    const liquidations = await this.transactionHistoryModel
      .find({ gameId, playerId, type: 'liquidation' })
      .sort({ timestamp: -1 })
      .exec();

    const totalRecovered = liquidations.reduce((sum, liquidation) => sum + liquidation.amount, 0);
    
    // Get the latest bankruptcy record to calculate remaining debt
    const bankruptcyRecord = await this.bankruptcyRecordModel
      .findOne({ gameId, playerId })
      .sort({ triggeredAt: -1 })
      .exec();

    const debtRemaining = bankruptcyRecord ? Math.max(0, bankruptcyRecord.debtAmount - totalRecovered) : 0;

    return { liquidations, totalRecovered, debtRemaining };
  }
}
