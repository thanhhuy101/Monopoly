import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import type { IGameRepository, IGameUseCase, IGameEventService, IGameService } from '../../domain/interfaces/game.interface';
import { Game, GameState, Player, GameSettings, BoardState } from '../../domain/entities/game.entity';

@Injectable()
export class GameUseCase implements IGameUseCase {
  constructor(
    @Inject('IGameRepository')
    private readonly gameRepository: IGameRepository,
    @Inject('IGameEventService')
    private readonly gameEventService: IGameEventService,
    @Inject('IGameService')
    private readonly gameService: IGameService,
  ) {}

  async startGame(roomId: string): Promise<Game> {
    const existingGame = await this.gameRepository.getGameByRoomId(roomId);
    if (existingGame) {
      throw new BadRequestException('Game already exists for this room');
    }

    // Create a new game with default parameters
    const gameId = `game_${roomId}_${Date.now()}`;
    const players: Player[] = []; // Will be populated when players join
    const settings: GameSettings = {
      turnTimeLimit: 60,
      autoRoll: false,
      startingMoney: 1500
    };
    const board: BoardState = {
      properties: {},
      houses: {},
      mortgages: {}
    };

    const game = new Game(gameId, roomId, players, settings, board);
    const savedGame = await this.gameRepository.createGame(game);
    
    this.gameEventService.emitGameStarted(roomId);
    this.gameEventService.emitGameUpdate(roomId, savedGame.gameState);
    
    return savedGame;
  }

  async rollDice(gameId: string, playerId: number): Promise<{ dice: [number, number]; game: Game }> {
    const game = await this.gameRepository.getGameById(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const result = await this.gameService.rollDice(gameId, playerId);
    const updatedGame = result.game;
    
    await this.gameRepository.updateGame(updatedGame);
    
    this.gameEventService.emitPlayerAction(game.roomId, playerId, 'roll', { dice: result.dice });
    this.gameEventService.emitGameUpdate(game.roomId, updatedGame.gameState);
    
    return result;
  }

  async buyProperty(gameId: string, playerId: number, propertyId: string): Promise<Game> {
    const game = await this.gameRepository.getGameById(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const updatedGame = await this.gameService.buyProperty(gameId, playerId, propertyId);
    await this.gameRepository.updateGame(updatedGame);
    
    this.gameEventService.emitPlayerAction(game.roomId, playerId, 'buy', { propertyId });
    this.gameEventService.emitGameUpdate(game.roomId, updatedGame.gameState);
    
    return updatedGame;
  }

  async buildHouse(gameId: string, playerId: number, propertyId: string): Promise<Game> {
    const game = await this.gameRepository.getGameById(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const updatedGame = await this.gameService.buildHouse(gameId, playerId, propertyId);
    await this.gameRepository.updateGame(updatedGame);
    
    this.gameEventService.emitPlayerAction(game.roomId, playerId, 'build', { propertyId });
    this.gameEventService.emitGameUpdate(game.roomId, updatedGame.gameState);
    
    return updatedGame;
  }

  async mortgageProperty(gameId: string, playerId: number, propertyId: string): Promise<Game> {
    const game = await this.gameRepository.getGameById(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const updatedGame = await this.gameService.mortgageProperty(gameId, playerId, propertyId);
    await this.gameRepository.updateGame(updatedGame);
    
    this.gameEventService.emitPlayerAction(game.roomId, playerId, 'mortgage', { propertyId });
    this.gameEventService.emitGameUpdate(game.roomId, updatedGame.gameState);
    
    return updatedGame;
  }

  async trade(
    gameId: string,
    fromPlayerId: number,
    toPlayerId: number,
    properties: string[],
    amount: number
  ): Promise<Game> {
    const game = await this.gameRepository.getGameById(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const updatedGame = await this.gameService.tradeProperty(gameId, fromPlayerId, toPlayerId, properties[0], amount);
    await this.gameRepository.updateGame(updatedGame);
    
    this.gameEventService.emitPlayerAction(game.roomId, fromPlayerId, 'trade', {
      toPlayerId,
      properties,
      amount
    });
    this.gameEventService.emitGameUpdate(game.roomId, updatedGame.gameState);
    
    return updatedGame;
  }

  async endTurn(gameId: string): Promise<Game> {
    const game = await this.gameRepository.getGameById(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const updatedGame = await this.gameService.endTurn(gameId);
    await this.gameRepository.updateGame(updatedGame);
    
    this.gameEventService.emitTurnChange(game.roomId, updatedGame.currentPlayer);
    this.gameEventService.emitGameUpdate(game.roomId, updatedGame.gameState);
    
    return updatedGame;
  }

  async finishGame(gameId: string): Promise<Game> {
    const game = await this.gameRepository.getGameById(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const winnerId = game.checkWinner();
    if (winnerId === null) {
      throw new BadRequestException('Game cannot be finished - no winner determined');
    }

    const updatedGame = await this.gameService.finishGame(gameId, winnerId);
    await this.gameRepository.updateGame(updatedGame);
    
    this.gameEventService.emitGameFinished(game.roomId, winnerId);
    this.gameEventService.emitGameUpdate(game.roomId, updatedGame.gameState);
    
    return updatedGame;
  }

  async getGameState(gameId: string): Promise<GameState | null> {
    const game = await this.gameRepository.getGameById(gameId);
    return game ? game.gameState : null;
  }

  async updatePlayerStatus(gameId: string, userId: string, status: 'online' | 'offline' | 'disconnected'): Promise<void> {
    await this.gameService.updatePlayerStatus(gameId, userId, status);
    
    const game = await this.gameRepository.getGameById(gameId);
    if (game) {
      const player = game.players.find(p => p.uid === userId);
      if (player) {
        this.gameEventService.emitPlayerStatus(game.roomId, player.id, status);
      }
    }
  }

  async checkBankruptcy(gameId: string, playerId: number): Promise<{ isBankrupt: boolean; debtAmount: number; canRecover: boolean; suggestedActions: string[] }> {
    const game = await this.gameRepository.getGameById(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const bankruptcyCheck = game.checkBankruptcy(playerId);
    const suggestedActions: string[] = [];

    if (bankruptcyCheck.isBankrupt) {
      if (bankruptcyCheck.canRecover) {
        suggestedActions.push('liquidate_assets', 'trade_with_players');
      } else {
        suggestedActions.push('eliminate_player');
      }
    }

    return {
      ...bankruptcyCheck,
      suggestedActions
    };
  }

  async startBankruptcyFlow(gameId: string, playerId: number, debtAmount: number): Promise<{ flowId: string; liquidationOptions: any[]; tradeOptions: Player[]; timeLimit: number }> {
    return this.gameService.startBankruptcyFlow(gameId, playerId, debtAmount);
  }

  async liquidateAssets(gameId: string, playerId: number, assetsToLiquidate: { propertyId: string; action: 'sell_house' | 'sell_deed' | 'mortgage' }[]): Promise<{ totalRecovered: number; remainingDebt: number; success: boolean }> {
    return this.gameService.liquidateAssets(gameId, playerId, assetsToLiquidate);
  }

  async createDebtTrade(gameId: string, playerId: number, tradePartnerId: number, offeredAssets: any[], requestedAmount: number): Promise<{ tradeId: string; status: 'pending' | 'accepted' | 'rejected'; expiresAt: Date }> {
    return this.gameService.createDebtTrade(gameId, playerId, tradePartnerId, offeredAssets, requestedAmount);
  }

  async eliminatePlayer(gameId: string, playerId: number, reason: 'bankruptcy' | 'disconnect' | 'quit'): Promise<{ eliminated: boolean; finalRank: number; spectatorMode: boolean }> {
    return this.gameService.eliminatePlayer(gameId, playerId, reason);
  }

  async spectateGame(gameId: string, playerId: number): Promise<{ spectatorToken: string; canInteract: boolean; viewOnly: boolean }> {
    return this.gameService.spectateGame(gameId, playerId);
  }

  async leaveSpectateRoom(gameId: string, playerId: number, spectatorToken: string): Promise<{ left: boolean; redirectUrl?: string }> {
    return this.gameService.leaveSpectateRoom(gameId, playerId, spectatorToken);
  }

  async getSpectators(gameId: string): Promise<{ spectators: any[]; total: number }> {
    return this.gameService.getSpectators(gameId);
  }

  async checkGameEnd(gameId: string): Promise<{ shouldEnd: boolean; winner?: any; finalStandings: any[] }> {
    return this.gameService.checkGameEnd(gameId);
  }

  async saveGameResults(gameId: string, results: any): Promise<{ saved: boolean; gameId: string; rewardsAssigned: boolean }> {
    return this.gameService.saveGameResults(gameId, results);
  }

  async getDetailedGameState(gameId: string, options: { includeSpectators?: boolean; includeHistory?: boolean; includeTransactions?: boolean }): Promise<{ gameState: GameState; spectators: any[]; recentHistory: any[]; marketStatus: any }> {
    return this.gameService.getDetailedGameState(gameId, options);
  }

  async getGameStats(gameId: string): Promise<{ players: any[]; market: any; game: any }> {
    return this.gameService.getGameStats(gameId);
  }

  async drawCard(gameId: string, playerId: number, cardType: 'chance' | 'chest'): Promise<{ cardType: 'chance' | 'chest'; card: any; result: any; game: any; message: string }> {
    const game = await this.gameRepository.getGameById(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const result = await this.gameService.drawCard(gameId, playerId, cardType);
    const updatedGame = result.game;
    
    await this.gameRepository.updateGame(updatedGame);
    
    this.gameEventService.emitPlayerAction(game.roomId, playerId, 'card_drawn', {
      cardType,
      card: result.card,
      result: result.result
    });
    this.gameEventService.emitGameUpdate(game.roomId, updatedGame.gameState);
    
    return result;
  }
}

@Injectable()
export class GameService implements IGameService {
  constructor(
    @Inject('IGameRepository')
    private readonly gameRepository: IGameRepository,
    @Inject('IGameEventService')
    private readonly gameEventService: IGameEventService,
  ) {}

  async startGame(roomId: string): Promise<Game> {
    const session = await this.gameRepository.getGameSession(roomId);
    if (!session) {
      throw new NotFoundException('Game session not found');
    }

    const players = session.gameState.players.map((player, index) => ({
      ...player,
      id: index,
      isCurrentTurn: index === 0
    }));

    const game = Game.create(roomId, players, session.gameState.settings);
    return game.startGame();
  }

  async rollDice(gameId: string, playerId: number): Promise<{ dice: [number, number]; game: Game }> {
    const game = await this.gameRepository.getGameById(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const dice = game.rollDice(playerId);
    const steps = dice[0] + dice[1];
    let updatedGame = game.movePlayer(playerId, steps);

    if (dice[0] === dice[1]) {
      updatedGame = updatedGame.movePlayer(playerId, dice[0] + dice[1]);
    }

    return { dice, game: updatedGame };
  }

  async movePlayer(gameId: string, playerId: number, steps: number): Promise<Game> {
    const game = await this.gameRepository.getGameById(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    return game.movePlayer(playerId, steps);
  }

  async buyProperty(gameId: string, playerId: number, propertyId: string): Promise<Game> {
    const game = await this.gameRepository.getGameById(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const propertyPrice = this.getPropertyPrice(propertyId);
    return game.buyProperty(playerId, propertyId, propertyPrice);
  }

  async buildHouse(gameId: string, playerId: number, propertyId: string): Promise<Game> {
    const game = await this.gameRepository.getGameById(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const player = game.players.find(p => p.id === playerId);
    if (!player) {
      throw new NotFoundException('Player not found');
    }

    const housePrice = this.getHousePrice(propertyId);
    if (player.money < housePrice) {
      throw new BadRequestException('Not enough money to build house');
    }

    const updatedPlayers = game.players.map(p => 
      p.id === playerId 
        ? { ...p, money: p.money - housePrice }
        : p
    );

    const updatedProperties = {
      ...game.board.properties,
      [propertyId]: {
        ...game.board.properties[propertyId],
        houses: (game.board.properties[propertyId]?.houses || 0) + 1
      }
    };

    const updatedBoard = {
      ...game.board,
      properties: updatedProperties
    };

    return new Game(
      game.id,
      game.roomId,
      updatedPlayers,
      game.settings,
      updatedBoard,
      game.phase,
      game.currentPlayer,
      game.dice,
      [...game.log, {
        timestamp: new Date(),
        message: `${player.username} built house on ${propertyId}`,
        playerId,
        type: 'action'
      }],
      game.createdAt,
      new Date(),
      game.winner
    );
  }

  async mortgageProperty(gameId: string, playerId: number, propertyId: string): Promise<Game> {
    const game = await this.gameRepository.getGameById(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const player = game.players.find(p => p.id === playerId);
    if (!player) {
      throw new NotFoundException('Player not found');
    }

    const mortgageValue = this.getMortgageValue(propertyId);

    const updatedPlayers = game.players.map(p => 
      p.id === playerId 
        ? { ...p, money: p.money + mortgageValue }
        : p
    );

    const updatedProperties = {
      ...game.board.properties,
      [propertyId]: {
        ...game.board.properties[propertyId],
        isMortgaged: true
      }
    };

    const updatedBoard = {
      ...game.board,
      properties: updatedProperties
    };

    return new Game(
      game.id,
      game.roomId,
      updatedPlayers,
      game.settings,
      updatedBoard,
      game.phase,
      game.currentPlayer,
      game.dice,
      [...game.log, {
        timestamp: new Date(),
        message: `${player.username} mortgaged ${propertyId}`,
        playerId,
        type: 'action'
      }],
      game.createdAt,
      new Date(),
      game.winner
    );
  }

  async tradeProperty(gameId: string, fromPlayerId: number, toPlayerId: number, propertyId: string, amount: number): Promise<Game> {
    const game = await this.gameRepository.getGameById(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const fromPlayer = game.players.find(p => p.id === fromPlayerId);
    const toPlayer = game.players.find(p => p.id === toPlayerId);

    if (!fromPlayer || !toPlayer) {
      throw new NotFoundException('Player not found');
    }

    if (fromPlayer.money < amount) {
      throw new BadRequestException('From player does not have enough money');
    }

    if (!fromPlayer.properties.includes(propertyId)) {
      throw new BadRequestException('From player does not own this property');
    }

    const updatedPlayers = game.players.map(p => {
      if (p.id === fromPlayerId) {
        return {
          ...p,
          money: p.money + amount,
          properties: p.properties.filter(prop => prop !== propertyId),
          lastAction: `Traded ${propertyId} to ${toPlayer.username} for ${amount}`
        };
      }
      if (p.id === toPlayerId) {
        return {
          ...p,
          money: p.money - amount,
          properties: [...p.properties, propertyId],
          lastAction: `Received ${propertyId} from ${fromPlayer.username} for ${amount}`
        };
      }
      return p;
    });

    const updatedProperties = {
      ...game.board.properties,
      [propertyId]: {
        ...game.board.properties[propertyId],
        ownerId: toPlayer.uid
      }
    };

    const updatedBoard = {
      ...game.board,
      properties: updatedProperties
    };

    return new Game(
      game.id,
      game.roomId,
      updatedPlayers,
      game.settings,
      updatedBoard,
      game.phase,
      game.currentPlayer,
      game.dice,
      [...game.log, {
        timestamp: new Date(),
        message: `${fromPlayer.username} traded ${propertyId} to ${toPlayer.username} for ${amount}`,
        type: 'trade'
      }],
      game.createdAt,
      new Date(),
      game.winner
    );
  }

  async endTurn(gameId: string): Promise<Game> {
    const game = await this.gameRepository.getGameById(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    return game.endTurn();
  }

  async finishGame(gameId: string, winnerId: number): Promise<Game> {
    const game = await this.gameRepository.getGameById(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    return game.finishGame(winnerId);
  }

  async getGameState(gameId: string): Promise<GameState | null> {
    const game = await this.gameRepository.getGameById(gameId);
    return game ? game.gameState : null;
  }

  async updatePlayerStatus(gameId: string, userId: string, status: 'online' | 'offline' | 'disconnected'): Promise<void> {
    const session = await this.gameRepository.getGameSession(gameId);
    if (session) {
      const updatedPlayers = session.players.map(p => 
        p.userId === userId 
          ? { ...p, status, lastSeen: new Date() }
          : p
      );

      const updatedSession = {
        ...session,
        players: updatedPlayers
      };

      await this.gameRepository.updateGameSession(updatedSession);
    }
  }

  // Phase 1: Bankruptcy APIs
  async checkBankruptcy(gameId: string, playerId: number): Promise<{ isBankrupt: boolean; debtAmount: number; canRecover: boolean; suggestedActions: string[] }> {
    const game = await this.gameRepository.getGameById(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const bankruptcyCheck = game.checkBankruptcy(playerId);
    const suggestedActions: string[] = [];

    if (bankruptcyCheck.isBankrupt) {
      if (bankruptcyCheck.canRecover) {
        suggestedActions.push('liquidate_assets', 'trade_with_players');
      } else {
        suggestedActions.push('eliminate_player');
      }
    }

    return {
      ...bankruptcyCheck,
      suggestedActions
    };
  }

  async startBankruptcyFlow(gameId: string, playerId: number, debtAmount: number): Promise<{ flowId: string; liquidationOptions: any[]; tradeOptions: Player[]; timeLimit: number }> {
    const game = await this.gameRepository.getGameById(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const player = game.players.find(p => p.id === playerId);
    if (!player) {
      throw new NotFoundException('Player not found');
    }

    const flowId = `bankruptcy_${gameId}_${playerId}_${Date.now()}`;
    const liquidationOptions = player.properties.map(propertyId => ({
      propertyId,
      propertyName: propertyId,
      marketValue: this.getPropertyPrice(propertyId),
      houseCount: game.board.properties[propertyId]?.houses || 0,
      isMortgaged: game.board.properties[propertyId]?.isMortgaged || false
    }));

    const tradeOptions = game.players.filter(p => !p.bankrupt && p.id !== playerId);
    const timeLimit = 300; // 5 minutes

    // Create bankruptcy record
    await this.gameRepository.createBankruptcyRecord({
      gameId,
      playerId,
      triggeredAt: new Date(),
      debtAmount,
      properties: player.properties,
      cash: player.money,
      totalValue: player.money + liquidationOptions.reduce((sum, opt) => sum + opt.marketValue, 0),
      resolutionType: 'liquidated'
    } as any);

    this.gameEventService.emitPlayerAction(game.roomId, playerId, 'bankruptcy_triggered', { debtAmount, flowId });

    return {
      flowId,
      liquidationOptions,
      tradeOptions,
      timeLimit
    };
  }

  async liquidateAssets(gameId: string, playerId: number, assetsToLiquidate: { propertyId: string; action: 'sell_house' | 'sell_deed' | 'mortgage' }[]): Promise<{ totalRecovered: number; remainingDebt: number; success: boolean }> {
    const game = await this.gameRepository.getGameById(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const liquidationResult = game.liquidateAssets(playerId, assetsToLiquidate);
    const updatedGame = game;

    await this.gameRepository.updateGame(updatedGame);

    // Create transaction record
    await this.gameRepository.createTransactionRecord({
      id: `transaction_${gameId}_${playerId}_${Date.now()}`,
      gameId,
      playerId,
      type: 'liquidation',
      amount: liquidationResult.totalRecovered,
      description: `Liquidated ${assetsToLiquidate.length} assets for $${liquidationResult.totalRecovered}`,
      relatedProperties: assetsToLiquidate.map(a => a.propertyId),
      timestamp: new Date()
    });

    this.gameEventService.emitPlayerAction(game.roomId, playerId, 'assets_liquidated', liquidationResult);
    this.gameEventService.emitGameUpdate(game.roomId, updatedGame.gameState);

    return liquidationResult;
  }

  private getPropertyPrice(propertyId: string): number {
    const propertyPrices: Record<string, number> = {
      'mediterranean': 60,
      'baltic': 60,
      'oriental': 100,
      'vermont': 100,
      'connecticut': 120,
      'st_charles': 140,
      'states': 140,
      'virginia': 160,
      'st_james': 180,
      'tennessee': 180,
      'new_york': 200,
      'kentucky': 220,
      'indiana': 220,
      'illinois': 240,
      'atlantic': 260,
      'ventnor': 260,
      'marvin': 280,
      'pacific': 300,
      'north_carolina': 300,
      'pennsylvania': 320,
      'park_place': 350,
      'boardwalk': 400
    };

    return propertyPrices[propertyId] || 100;
  }

  private getHousePrice(propertyId: string): number {
    return Math.floor(this.getPropertyPrice(propertyId) * 0.5);
  }

  private getMortgageValue(propertyId: string): number {
    return Math.floor(this.getPropertyPrice(propertyId) * 0.5);
  }



  async eliminatePlayer(gameId: string, playerId: number, reason: 'bankruptcy' | 'disconnect' | 'quit'): Promise<{ eliminated: boolean; finalRank: number; spectatorMode: boolean }> {
    const game = await this.gameRepository.getGameById(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const updatedGame = game.eliminatePlayer(playerId, reason);
    await this.gameRepository.updateGame(updatedGame);

    const player = updatedGame.players.find(p => p.id === playerId);
    const finalRank = player?.finalRank || 1;
    const spectatorMode = reason === 'bankruptcy';

    // Update bankruptcy record
    if (reason === 'bankruptcy') {
      const bankruptcyRecords = await this.gameRepository.getBankruptcyRecords(gameId);
      const lastRecord = bankruptcyRecords[bankruptcyRecords.length - 1];
      if (lastRecord) {
        lastRecord.resolution = {
          type: 'eliminated',
          eliminatedAt: new Date(),
          finalRank
        };
        // Update the record in repository
      }
    }

    // Create transaction record
    await this.gameRepository.createTransactionRecord({
      id: `transaction_${gameId}_${playerId}_${Date.now()}`,
      gameId,
      playerId,
      type: 'elimination',
      amount: 0,
      description: `Player eliminated (${reason})`,
      timestamp: new Date()
    });

    this.gameEventService.emitPlayerAction(game.roomId, playerId, 'player_eliminated', { reason, finalRank });
    this.gameEventService.emitGameUpdate(game.roomId, updatedGame.gameState);

    return {
      eliminated: true,
      finalRank,
      spectatorMode
    };
  }

  // Additional methods to satisfy IGameUseCase interface
  async createDebtTrade(gameId: string, playerId: number, tradePartnerId: number, offeredAssets: any[], requestedAmount: number): Promise<{ tradeId: string; status: 'pending' | 'accepted' | 'rejected'; expiresAt: Date }> {
    const tradeId = `trade_${gameId}_${playerId}_${Date.now()}`;
    const expiresAt = new Date(Date.now() + 300000); // 5 minutes from now

    // Create transaction record
    await this.gameRepository.createTransactionRecord({
      id: `transaction_${gameId}_${playerId}_${Date.now()}`,
      gameId,
      playerId,
      type: 'trade',
      amount: requestedAmount,
      description: `Debt trade: ${offeredAssets.length} assets for $${requestedAmount}`,
      relatedPlayers: [playerId, tradePartnerId],
      relatedProperties: offeredAssets.filter(a => a.type === 'property').map(a => a.propertyId),
      metadata: { tradeId },
      timestamp: new Date()
    });

    return {
      tradeId,
      status: 'pending',
      expiresAt
    };
  }

  async spectateGame(gameId: string, playerId: number): Promise<{ spectatorToken: string; canInteract: boolean; viewOnly: boolean }> {
    const spectatorToken = `spectator_${gameId}_${playerId}_${Date.now()}`;
    
    await this.gameRepository.createSpectatorSession({
      gameId,
      playerId,
      token: spectatorToken,
      joinedAt: new Date(),
      lastActive: new Date(),
      canChat: true,
      canViewHistory: true,
      canViewTransactions: false,
      isActive: true
    } as any);

    return {
      spectatorToken,
      canInteract: false,
      viewOnly: true
    };
  }

  async leaveSpectateRoom(gameId: string, playerId: number, spectatorToken: string): Promise<{ left: boolean; redirectUrl?: string }> {
    const result = await this.gameRepository.removeSpectatorSession(spectatorToken);
    return {
      left: result,
      redirectUrl: '/rooms'
    };
  }

  async getSpectators(gameId: string): Promise<{ spectators: any[]; total: number }> {
    const spectators = await this.gameRepository.getSpectatorSessions(gameId);
    return {
      spectators: spectators.map(s => ({
        playerId: s.playerId,
        username: `Player${s.playerId}`,
        joinedAt: s.joinedAt,
        canChat: s.permissions.canChat
      })),
      total: spectators.length
    };
  }

  async checkGameEnd(gameId: string): Promise<{ shouldEnd: boolean; winner?: any; finalStandings: any[] }> {
    const game = await this.gameRepository.getGameById(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const winner = game.checkWinner();
    const shouldEnd = winner !== null || game.phase === 'finished';
    
    const finalStandings = game.players
      .map(p => ({
        playerId: p.id,
        username: p.username,
        finalAssets: p.money + this.calculatePropertyValue(p.properties),
        rank: p.finalRank || 0,
        eliminatedAt: p.eliminatedAt
      }))
      .sort((a, b) => b.finalAssets - a.finalAssets);

    return {
      shouldEnd,
      winner: winner ? game.players.find(p => p.id === winner) : undefined,
      finalStandings
    };
  }

  async saveGameResults(gameId: string, results: any): Promise<{ saved: boolean; gameId: string; rewardsAssigned: boolean }> {
    // Create game session record
    await this.gameRepository.saveGameSession({
      roomId: gameId,
      players: results.finalStandings.map((s: any) => s.playerId),
      status: 'finished' as any,
      winner: results.winnerId,
      finalStandings: results.finalStandings,
      gameStats: results.gameStats,
      createdAt: new Date(),
      finishedAt: new Date()
    } as any);

    return {
      saved: true,
      gameId,
      rewardsAssigned: true
    };
  }

  async getDetailedGameState(gameId: string, options: { includeSpectators?: boolean; includeHistory?: boolean; includeTransactions?: boolean }): Promise<{ gameState: any; spectators: any[]; recentHistory: any[]; marketStatus: any }> {
    const game = await this.gameRepository.getGameById(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const spectators = options.includeSpectators ? await this.gameRepository.getSpectatorSessions(gameId) : [];
    const recentHistory = options.includeHistory ? game.log.slice(-10) : [];
    const marketStatus = {
      totalPropertiesInPlay: Object.keys(game.board.properties).length,
      totalMortgaged: Object.values(game.board.properties).filter((p: any) => p.isMortgaged).length,
      averagePropertyValue: this.calculateAveragePropertyValue(game.board.properties)
    };

    return {
      gameState: game.gameState,
      spectators,
      recentHistory,
      marketStatus
    };
  }

  async getGameStats(gameId: string): Promise<{ players: any[]; market: any; game: any }> {
    const game = await this.gameRepository.getGameById(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const players = game.players.map(p => ({
      playerId: p.id,
      username: p.username,
      money: p.money,
      properties: p.properties.length,
      totalAssets: p.money + this.calculatePropertyValue(p.properties),
      rank: p.finalRank || 0,
      isBankrupt: p.bankrupt,
      isSpectator: p.isSpectator || false
    }));

    const market = {
      totalPropertiesInPlay: Object.keys(game.board.properties).length,
      totalMortgaged: Object.values(game.board.properties).filter((p: any) => p.isMortgaged).length,
      averagePropertyValue: this.calculateAveragePropertyValue(game.board.properties)
    };

    const gameStats = {
      currentTurn: game.currentPlayer,
      timeRemaining: 0, // Would need to be calculated based on turn start time
      activePlayers: game.players.filter(p => !p.bankrupt && !p.isSpectator).length,
      spectators: 0 // Would need to be fetched from spectator sessions
    };

    return {
      players,
      market,
      game: gameStats
    };
  }

  private calculatePropertyValue(properties: string[]): number {
    return properties.reduce((total, propertyId) => total + this.getPropertyPrice(propertyId), 0);
  }

  private calculateAveragePropertyValue(properties: Record<string, any>): number {
    const propertyValues = Object.keys(properties).map(id => this.getPropertyPrice(id));
    return propertyValues.length > 0 ? propertyValues.reduce((sum, val) => sum + val, 0) / propertyValues.length : 0;
  }

  // Card drawing methods
  async drawCard(gameId: string, playerId: number, cardType: 'chance' | 'chest'): Promise<{ cardType: 'chance' | 'chest'; card: any; result: any; game: any; message: string }> {
    const game = await this.gameRepository.getGameById(gameId);
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const player = game.players.find(p => p.id === playerId);
    if (!player) {
      throw new NotFoundException('Player not found');
    }

    // Draw card from game entity
    const cardDrawResult = cardType === 'chance' 
      ? game.drawChanceCard(playerId)
      : game.drawChestCard(playerId);

    // Apply card effects to player
    let updatedGame = game;
    if (cardDrawResult.result.type === 'money' && cardDrawResult.result.amount) {
      updatedGame = this.updatePlayerMoney(game, playerId, cardDrawResult.result.amount);
      await this.gameRepository.updateGame(updatedGame);
      
      // Create transaction record
      await this.gameRepository.createTransactionRecord({
        id: `transaction_${gameId}_${playerId}_${Date.now()}`,
        gameId,
        playerId,
        type: cardDrawResult.result.amount > 0 ? 'buy' : 'sell',
        amount: cardDrawResult.result.amount,
        description: `Card draw: ${cardDrawResult.result.message}`,
        timestamp: new Date()
      });
    } else if (cardDrawResult.result.type === 'move' && cardDrawResult.result.newPosition !== undefined) {
      updatedGame = this.movePlayerToPosition(game, playerId, cardDrawResult.result.newPosition);
      await this.gameRepository.updateGame(updatedGame);
    } else if (cardDrawResult.result.type === 'jail') {
      updatedGame = this.sendPlayerToJail(game, playerId);
      await this.gameRepository.updateGame(updatedGame);
    }

    // Emit card draw event
    this.gameEventService.emitPlayerAction(game.roomId, playerId, 'card_drawn', {
      cardType,
      card: cardDrawResult.card,
      result: cardDrawResult.result
    });

    return {
      cardType,
      card: cardDrawResult.card,
      result: cardDrawResult.result,
      game: updatedGame.gameState,
      message: `${player.username} drew a ${cardType === 'chance' ? 'Chance' : 'Community Chest'} card`
    };
  }

  private updatePlayerMoney(game: Game, playerId: number, amount: number): Game {
    const playerIndex = game.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) return game;

    const updatedPlayers = [...game.players];
    updatedPlayers[playerIndex] = {
      ...updatedPlayers[playerIndex],
      money: updatedPlayers[playerIndex].money + amount
    };

    return new Game(
      game.id,
      game.roomId,
      updatedPlayers,
      game.settings,
      game.board,
      game.phase,
      game.currentPlayer,
      game.dice,
      [...game.log, {
        timestamp: new Date(),
        message: `Player ${playerId} ${amount > 0 ? 'received' : 'paid'} $${Math.abs(amount)}`,
        playerId,
        type: 'action'
      }],
      game.createdAt,
      new Date(),
      game.winner,
      game.deckState
    );
  }

  private movePlayerToPosition(game: Game, playerId: number, position: number): Game {
    const playerIndex = game.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) return game;

    const updatedPlayers = [...game.players];
    updatedPlayers[playerIndex] = {
      ...updatedPlayers[playerIndex],
      position
    };

    return new Game(
      game.id,
      game.roomId,
      updatedPlayers,
      game.settings,
      game.board,
      game.phase,
      game.currentPlayer,
      game.dice,
      [...game.log, {
        timestamp: new Date(),
        message: `Player ${playerId} moved to position ${position}`,
        playerId,
        type: 'action'
      }],
      game.createdAt,
      new Date(),
      game.winner,
      game.deckState
    );
  }

  private sendPlayerToJail(game: Game, playerId: number): Game {
    const playerIndex = game.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) return game;

    const updatedPlayers = [...game.players];
    updatedPlayers[playerIndex] = {
      ...updatedPlayers[playerIndex],
      position: 10, // Jail position
      jailStatus: { inJail: true, turns: 0 }
    };

    return new Game(
      game.id,
      game.roomId,
      updatedPlayers,
      game.settings,
      game.board,
      game.phase,
      game.currentPlayer,
      game.dice,
      [...game.log, {
        timestamp: new Date(),
        message: `Player ${playerId} sent to jail`,
        playerId,
        type: 'action'
      }],
      game.createdAt,
      new Date(),
      game.winner,
      game.deckState
    );
  }
}
