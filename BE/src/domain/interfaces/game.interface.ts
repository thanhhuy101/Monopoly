import { Game, GameSession, GameHistory, GameState, Player, Spectator, BankruptcyRecord, TransactionRecord } from '../entities/game.entity';

export interface IGameRepository {
  createGame(game: Game): Promise<Game>;
  getGameById(gameId: string): Promise<Game | null>;
  getGameByRoomId(roomId: string): Promise<Game | null>;
  updateGame(game: Game): Promise<Game>;
  deleteGame(gameId: string): Promise<boolean>;
  saveGameSession(session: GameSession): Promise<GameSession>;
  getGameSession(roomId: string): Promise<GameSession | null>;
  updateGameSession(session: GameSession): Promise<GameSession>;
  saveGameHistory(history: GameHistory): Promise<GameHistory>;
  getGameHistoryByRoomId(roomId: string): Promise<GameHistory[]>;
  getGameHistoryByUserId(userId: string): Promise<GameHistory[]>;
  
  // New methods for bankruptcy and spectator features
  createBankruptcyRecord(record: BankruptcyRecord): Promise<BankruptcyRecord>;
  getBankruptcyRecords(gameId: string): Promise<BankruptcyRecord[]>;
  getBankruptcyRecordsByPlayer(playerId: number): Promise<BankruptcyRecord[]>;
  
  createSpectatorSession(spectator: Spectator): Promise<Spectator>;
  getSpectatorSessions(gameId: string): Promise<Spectator[]>;
  getSpectatorByToken(token: string): Promise<Spectator | null>;
  updateSpectatorSession(spectator: Spectator): Promise<Spectator>;
  removeSpectatorSession(token: string): Promise<boolean>;
  
  createTransactionRecord(transaction: TransactionRecord): Promise<TransactionRecord>;
  getTransactionHistory(gameId: string, playerId?: number, type?: string, limit?: number, offset?: number): Promise<{ transactions: TransactionRecord[]; total: number; hasMore: boolean }>;
  getLiquidationHistory(gameId: string, playerId: number): Promise<{ liquidations: any[]; totalRecovered: number; debtRemaining: number }>;
}

export interface IGameService {
  startGame(roomId: string): Promise<Game>;
  rollDice(gameId: string, playerId: number): Promise<{ dice: [number, number]; game: Game }>;
  movePlayer(gameId: string, playerId: number, steps: number): Promise<Game>;
  buyProperty(gameId: string, playerId: number, propertyId: string): Promise<Game>;
  buildHouse(gameId: string, playerId: number, propertyId: string): Promise<Game>;
  mortgageProperty(gameId: string, playerId: number, propertyId: string): Promise<Game>;
  tradeProperty(gameId: string, fromPlayerId: number, toPlayerId: number, propertyId: string, amount: number): Promise<Game>;
  endTurn(gameId: string): Promise<Game>;
  finishGame(gameId: string, winnerId: number): Promise<Game>;
  getGameState(gameId: string): Promise<GameState | null>;
  updatePlayerStatus(gameId: string, userId: string, status: 'online' | 'offline' | 'disconnected'): Promise<void>;
  
  // Card drawing method
  drawCard(gameId: string, playerId: number, cardType: 'chance' | 'chest'): Promise<{ cardType: 'chance' | 'chest'; card: any; result: any; game: any; message: string }>;
  
  // New methods for bankruptcy and spectator features
  checkBankruptcy(gameId: string, playerId: number): Promise<{ isBankrupt: boolean; debtAmount: number; canRecover: boolean; suggestedActions: string[] }>;
  startBankruptcyFlow(gameId: string, playerId: number, debtAmount: number): Promise<{ flowId: string; liquidationOptions: any[]; tradeOptions: Player[]; timeLimit: number }>;
  liquidateAssets(gameId: string, playerId: number, assetsToLiquidate: { propertyId: string; action: 'sell_house' | 'sell_deed' | 'mortgage' }[]): Promise<{ totalRecovered: number; remainingDebt: number; success: boolean }>;
  createDebtTrade(gameId: string, playerId: number, tradePartnerId: number, offeredAssets: any[], requestedAmount: number): Promise<{ tradeId: string; status: 'pending' | 'accepted' | 'rejected'; expiresAt: Date }>;
  eliminatePlayer(gameId: string, playerId: number, reason: 'bankruptcy' | 'disconnect' | 'quit'): Promise<{ eliminated: boolean; finalRank: number; spectatorMode: boolean }>;
  
  // Spectator methods
  spectateGame(gameId: string, playerId: number): Promise<{ spectatorToken: string; canInteract: boolean; viewOnly: boolean }>;
  leaveSpectateRoom(gameId: string, playerId: number, spectatorToken: string): Promise<{ left: boolean; redirectUrl?: string }>;
  getSpectators(gameId: string): Promise<{ spectators: Spectator[]; total: number }>;
  
  // Game completion methods
  checkGameEnd(gameId: string): Promise<{ shouldEnd: boolean; winner?: any; finalStandings: any[] }>;
  saveGameResults(gameId: string, results: any): Promise<{ saved: boolean; gameId: string; rewardsAssigned: boolean }>;
  
  // Enhanced state methods
  getDetailedGameState(gameId: string, options: { includeSpectators?: boolean; includeHistory?: boolean; includeTransactions?: boolean }): Promise<{ gameState: GameState; spectators: Spectator[]; recentHistory: any[]; marketStatus: any }>;
  getGameStats(gameId: string): Promise<{ players: any[]; market: any; game: any }>;
}

export interface IBoardService {
  calculateRent(propertyId: string, boardState: any): number;
  canBuildHouse(propertyId: string, boardState: any): boolean;
  canMortgage(propertyId: string, boardState: any): boolean;
  getPropertyPrice(propertyId: string): number;
  getHousePrice(propertyId: string): number;
  getMortgageValue(propertyId: string): number;
}

export interface ITradeService {
  validateTrade(game: Game, fromPlayerId: number, toPlayerId: number, properties: string[], amount: number): boolean;
  executeTrade(game: Game, fromPlayerId: number, toPlayerId: number, properties: string[], amount: number): Game;
}

export interface IGameValidationService {
  validatePlayerTurn(game: Game, playerId: number): boolean;
  validatePropertyPurchase(game: Game, playerId: number, propertyId: string): boolean;
  validateHouseBuilding(game: Game, playerId: number, propertyId: string): boolean;
  validateTrade(game: Game, fromPlayerId: number, toPlayerId: number, properties: string[], amount: number): boolean;
  validateGameEnd(game: Game): boolean;
}

export interface IGameEventService {
  emitGameUpdate(roomId: string, gameState: GameState): void;
  emitPlayerAction(roomId: string, playerId: number, action: string, data: any): void;
  emitTurnChange(roomId: string, currentPlayerId: number): void;
  emitGameStarted(roomId: string): void;
  emitGameFinished(roomId: string, winnerId: number): void;
  emitPlayerStatus(roomId: string, playerId: number, status: string): void;
}

export interface IGameLogicService {
  rollDice(): [number, number];
  calculateMovement(dice: [number, number]): number;
  checkJail(player: Player): boolean;
  handleBankruptcy(game: Game, playerId: number): Game;
  checkWinCondition(game: Game): number | null;
  calculatePlayerWealth(player: Player, boardState: any): number;
}

export interface IGameUseCase {
  startGame(roomId: string): Promise<Game>;
  rollDice(gameId: string, playerId: number): Promise<{ dice: [number, number]; game: Game }>;
  buyProperty(gameId: string, playerId: number, propertyId: string): Promise<Game>;
  buildHouse(gameId: string, playerId: number, propertyId: string): Promise<Game>;
  mortgageProperty(gameId: string, playerId: number, propertyId: string): Promise<Game>;
  trade(gameId: string, fromPlayerId: number, toPlayerId: number, properties: string[], amount: number): Promise<Game>;
  endTurn(gameId: string): Promise<Game>;
  finishGame(gameId: string): Promise<Game>;
  getGameState(gameId: string): Promise<GameState | null>;
  
  // New methods for bankruptcy and spectator features
  checkBankruptcy(gameId: string, playerId: number): Promise<{ isBankrupt: boolean; debtAmount: number; canRecover: boolean; suggestedActions: string[] }>;
  startBankruptcyFlow(gameId: string, playerId: number, debtAmount: number): Promise<{ flowId: string; liquidationOptions: any[]; tradeOptions: Player[]; timeLimit: number }>;
  liquidateAssets(gameId: string, playerId: number, assetsToLiquidate: { propertyId: string; action: 'sell_house' | 'sell_deed' | 'mortgage' }[]): Promise<{ totalRecovered: number; remainingDebt: number; success: boolean }>;
  createDebtTrade(gameId: string, playerId: number, tradePartnerId: number, offeredAssets: any[], requestedAmount: number): Promise<{ tradeId: string; status: 'pending' | 'accepted' | 'rejected'; expiresAt: Date }>;
  eliminatePlayer(gameId: string, playerId: number, reason: 'bankruptcy' | 'disconnect' | 'quit'): Promise<{ eliminated: boolean; finalRank: number; spectatorMode: boolean }>;
  
  // Spectator methods
  spectateGame(gameId: string, playerId: number): Promise<{ spectatorToken: string; canInteract: boolean; viewOnly: boolean }>;
  leaveSpectateRoom(gameId: string, playerId: number, spectatorToken: string): Promise<{ left: boolean; redirectUrl?: string }>;
  getSpectators(gameId: string): Promise<{ spectators: any[]; total: number }>;
  
  // Card drawing methods
  drawCard(gameId: string, playerId: number, cardType: 'chance' | 'chest'): Promise<{ cardType: 'chance' | 'chest'; card: any; result: any; game: any; message: string }>;
  
  // Game completion methods
  checkGameEnd(gameId: string): Promise<{ shouldEnd: boolean; winner?: any; finalStandings: any[] }>;
  saveGameResults(gameId: string, results: any): Promise<{ saved: boolean; gameId: string; rewardsAssigned: boolean }>;
  
  // Enhanced state methods
  getDetailedGameState(gameId: string, options: { includeSpectators?: boolean; includeHistory?: boolean; includeTransactions?: boolean }): Promise<{ gameState: GameState; spectators: any[]; recentHistory: any[]; marketStatus: any }>;
  getGameStats(gameId: string): Promise<{ players: any[]; market: any; game: any }>;
  
  // Additional method for updating player status
  updatePlayerStatus(gameId: string, userId: string, status: 'online' | 'offline' | 'disconnected'): Promise<void>;
}

export interface IGameSocketEvents {
  'game:state-update': (data: { gameState: GameState }) => void;
  'game:started': (data: { gameId: string }) => void;
  'game:finished': (data: { gameId: string; winnerId: number }) => void;
  'turn:changed': (data: { currentPlayerId: number }) => void;
  'dice:rolled': (data: { playerId: number; dice: [number, number] }) => void;
  'property:purchased': (data: { playerId: number; propertyId: string }) => void;
  'player:bankrupt': (data: { playerId: number }) => void;
  'player:status': (data: { playerId: number; status: string }) => void;
  'game:action': (data: { playerId: number; action: string; data: any }) => void;
}

export interface IGameSocketHandlers {
  joinGame: (data: { roomId: string }) => void;
  leaveGame: (data: { roomId: string }) => void;
  rollDice: (data: { gameId: string }) => void;
  buyProperty: (data: { gameId: string; propertyId: string }) => void;
  buildHouse: (data: { gameId: string; propertyId: string }) => void;
  mortgageProperty: (data: { gameId: string; propertyId: string }) => void;
  trade: (data: { gameId: string; toPlayerId: number; properties: string[]; amount: number }) => void;
  endTurn: (data: { gameId: string }) => void;
}
