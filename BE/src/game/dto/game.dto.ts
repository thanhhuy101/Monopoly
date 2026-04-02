import { IsString, IsNumber, IsArray, IsOptional, IsNotEmpty, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StartGameDto {
  @ApiProperty({ description: 'Room ID' })
  @IsString()
  @IsNotEmpty()
  roomId: string;
}

export class RollDiceDto {
  @ApiProperty({ description: 'Game ID' })
  @IsString()
  @IsNotEmpty()
  gameId: string;

  @ApiProperty({ description: 'Player ID' })
  @IsNumber()
  playerId: number;
}

export class BuyPropertyDto {
  @ApiProperty({ description: 'Game ID' })
  @IsString()
  @IsNotEmpty()
  gameId: string;

  @ApiProperty({ description: 'Player ID' })
  @IsNumber()
  playerId: number;

  @ApiProperty({ description: 'Property ID' })
  @IsString()
  @IsNotEmpty()
  propertyId: string;
}

export class BuildHouseDto {
  @ApiProperty({ description: 'Game ID' })
  @IsString()
  @IsNotEmpty()
  gameId: string;

  @ApiProperty({ description: 'Player ID' })
  @IsNumber()
  playerId: number;

  @ApiProperty({ description: 'Property ID' })
  @IsString()
  @IsNotEmpty()
  propertyId: string;
}

export class MortgagePropertyDto {
  @ApiProperty({ description: 'Game ID' })
  @IsString()
  @IsNotEmpty()
  gameId: string;

  @ApiProperty({ description: 'Player ID' })
  @IsNumber()
  playerId: number;

  @ApiProperty({ description: 'Property ID' })
  @IsString()
  @IsNotEmpty()
  propertyId: string;
}

export class TradeDto {
  @ApiProperty({ description: 'Game ID' })
  @IsString()
  @IsNotEmpty()
  gameId: string;

  @ApiProperty({ description: 'From player ID' })
  @IsNumber()
  fromPlayerId: number;

  @ApiProperty({ description: 'To player ID' })
  @IsNumber()
  toPlayerId: number;

  @ApiProperty({ description: 'Properties to trade', type: [String] })
  @IsArray()
  @IsString({ each: true })
  properties: string[];

  @ApiProperty({ description: 'Trade amount' })
  @IsNumber()
  @Min(0)
  amount: number;
}

export class EndTurnDto {
  @ApiProperty({ description: 'Game ID' })
  @IsString()
  @IsNotEmpty()
  gameId: string;
}

export class FinishGameDto {
  @ApiProperty({ description: 'Game ID' })
  @IsString()
  @IsNotEmpty()
  gameId: string;

  @ApiProperty({ description: 'Winner ID' })
  @IsNumber()
  winnerId: number;
}

export class GetGameStateDto {
  @ApiProperty({ description: 'Game ID' })
  @IsString()
  @IsNotEmpty()
  gameId: string;
}

export class UpdatePlayerStatusDto {
  @ApiProperty({ description: 'Game ID' })
  @IsString()
  @IsNotEmpty()
  gameId: string;

  @ApiProperty({ description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Player status', enum: ['online', 'offline', 'disconnected'] })
  @IsString()
  @IsNotEmpty()
  status: 'online' | 'offline' | 'disconnected';
}

// Response DTOs
export class GameStateResponseDto {
  @ApiProperty({ description: 'Game state' })
  gameState: any;

  @ApiPropertyOptional({ description: 'Success message' })
  message?: string;
}

export class RollDiceResponseDto {
  @ApiProperty({ description: 'Dice values', type: [Number] })
  dice: [number, number];

  @ApiProperty({ description: 'Updated game state' })
  game: any;
}

export class GameActionResponseDto {
  @ApiProperty({ description: 'Updated game state' })
  game: any;

  @ApiProperty({ description: 'Success message' })
  message: string;
}

export class GameListResponseDto {
  @ApiProperty({ description: 'List of games', type: [Object] })
  games: any[];

  @ApiProperty({ description: 'Total count' })
  total: number;
}

export class GameHistoryResponseDto {
  @ApiProperty({ description: 'Game history entries', type: [Object] })
  history: any[];

  @ApiProperty({ description: 'Total count' })
  total: number;
}

// WebSocket DTOs
export class JoinGameDto {
  @ApiProperty({ description: 'Room ID' })
  @IsString()
  @IsNotEmpty()
  roomId: string;
}

export class LeaveGameDto {
  @ApiProperty({ description: 'Room ID' })
  @IsString()
  @IsNotEmpty()
  roomId: string;
}

export class GameActionDto {
  @ApiProperty({ description: 'Game ID' })
  @IsString()
  @IsNotEmpty()
  gameId: string;

  @ApiProperty({ description: 'Player ID' })
  @IsNumber()
  playerId: number;

  @ApiProperty({ description: 'Action type' })
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiPropertyOptional({ description: 'Action data' })
  data?: any;
}

// Bankruptcy DTOs
export class CheckBankruptcyDto {
  @ApiProperty({ description: 'Game ID' })
  @IsString()
  @IsNotEmpty()
  gameId: string;

  @ApiProperty({ description: 'Player ID' })
  @IsNumber()
  playerId: number;
}

export class BankruptcyFlowDto {
  @ApiProperty({ description: 'Game ID' })
  @IsString()
  @IsNotEmpty()
  gameId: string;

  @ApiProperty({ description: 'Player ID' })
  @IsNumber()
  playerId: number;

  @ApiProperty({ description: 'Debt amount' })
  @IsNumber()
  debtAmount: number;
}

export class LiquidateAssetsDto {
  @ApiProperty({ description: 'Game ID' })
  @IsString()
  @IsNotEmpty()
  gameId: string;

  @ApiProperty({ description: 'Player ID' })
  @IsNumber()
  playerId: number;

  @ApiProperty({ description: 'Assets to liquidate', type: [Object] })
  @IsArray()
  assetsToLiquidate: {
    propertyId: string;
    action: 'sell_house' | 'sell_deed' | 'mortgage';
  }[];
}

export class DebtTradeDto {
  @ApiProperty({ description: 'Game ID' })
  @IsString()
  @IsNotEmpty()
  gameId: string;

  @ApiProperty({ description: 'Player ID' })
  @IsNumber()
  playerId: number;

  @ApiProperty({ description: 'Trade partner ID' })
  @IsNumber()
  tradePartnerId: number;

  @ApiProperty({ description: 'Offered assets', type: [Object] })
  @IsArray()
  offeredAssets: {
    propertyId: string;
    type: 'property' | 'cash';
  }[];

  @ApiProperty({ description: 'Requested amount' })
  @IsNumber()
  requestedAmount: number;
}

export class EliminatePlayerDto {
  @ApiProperty({ description: 'Game ID' })
  @IsString()
  @IsNotEmpty()
  gameId: string;

  @ApiProperty({ description: 'Player ID' })
  @IsNumber()
  playerId: number;

  @ApiProperty({ description: 'Elimination reason', enum: ['bankruptcy', 'disconnect', 'quit'] })
  @IsString()
  @IsNotEmpty()
  reason: 'bankruptcy' | 'disconnect' | 'quit';
}

// Spectator DTOs
export class SpectateDto {
  @ApiProperty({ description: 'Game ID' })
  @IsString()
  @IsNotEmpty()
  gameId: string;

  @ApiProperty({ description: 'Player ID' })
  @IsNumber()
  playerId: number;
}

export class LeaveSpectatorDto {
  @ApiProperty({ description: 'Game ID' })
  @IsString()
  @IsNotEmpty()
  gameId: string;

  @ApiProperty({ description: 'Player ID' })
  @IsNumber()
  playerId: number;

  @ApiProperty({ description: 'Spectator token' })
  @IsString()
  @IsNotEmpty()
  spectatorToken: string;
}

// Game Completion DTOs
export class CheckGameEndDto {
  @ApiProperty({ description: 'Game ID' })
  @IsString()
  @IsNotEmpty()
  gameId: string;
}

export class SaveResultsDto {
  @ApiProperty({ description: 'Game ID' })
  @IsString()
  @IsNotEmpty()
  gameId: string;

  @ApiProperty({ description: 'Game results', type: Object })
  results: {
    winnerId: number;
    finalStandings: {
      playerId: number;
      rank: number;
      finalAssets: number;
      playTime: number;
      eliminatedAt?: Date;
    }[];
    gameStats: {
      totalTurns: number;
      duration: number;
      totalTransactions: number;
    };
  };
}

// Query DTOs
export class TransactionHistoryQueryDto {
  @ApiPropertyOptional({ description: 'Player ID filter' })
  @IsOptional()
  @IsNumber()
  playerId?: number;

  @ApiPropertyOptional({ description: 'Transaction type filter' })
  @IsOptional()
  @IsString()
  type?: 'buy' | 'sell' | 'trade' | 'mortgage' | 'bankruptcy';

  @ApiPropertyOptional({ description: 'Limit results' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({ description: 'Offset results' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  offset?: number;
}

export class DetailedStateQueryDto {
  @ApiPropertyOptional({ description: 'Include spectators' })
  @IsOptional()
  includeSpectators?: boolean;

  @ApiPropertyOptional({ description: 'Include history' })
  @IsOptional()
  includeHistory?: boolean;

  @ApiPropertyOptional({ description: 'Include transactions' })
  @IsOptional()
  includeTransactions?: boolean;
}

// Response DTOs
export class BankruptcyCheckResponseDto {
  @ApiProperty({ description: 'Is bankrupt' })
  isBankrupt: boolean;

  @ApiProperty({ description: 'Debt amount' })
  debtAmount: number;

  @ApiProperty({ description: 'Can recover' })
  canRecover: boolean;

  @ApiProperty({ description: 'Suggested actions', type: [String] })
  suggestedActions: string[];
}

export class BankruptcyFlowResponseDto {
  @ApiProperty({ description: 'Flow ID' })
  flowId: string;

  @ApiProperty({ description: 'Liquidation options', type: [Object] })
  liquidationOptions: any[];

  @ApiProperty({ description: 'Trade options', type: [Object] })
  tradeOptions: any[];

  @ApiProperty({ description: 'Time limit' })
  timeLimit: number;
}

export class LiquidationResponseDto {
  @ApiProperty({ description: 'Total recovered' })
  totalRecovered: number;

  @ApiProperty({ description: 'Remaining debt' })
  remainingDebt: number;

  @ApiProperty({ description: 'Success status' })
  success: boolean;
}

export class DebtTradeResponseDto {
  @ApiProperty({ description: 'Trade ID' })
  tradeId: string;

  @ApiProperty({ description: 'Trade status', enum: ['pending', 'accepted', 'rejected'] })
  status: 'pending' | 'accepted' | 'rejected';

  @ApiProperty({ description: 'Expires at' })
  expiresAt: Date;
}

export class EliminationResponseDto {
  @ApiProperty({ description: 'Eliminated status' })
  eliminated: boolean;

  @ApiProperty({ description: 'Final rank' })
  finalRank: number;

  @ApiProperty({ description: 'Spectator mode enabled' })
  spectatorMode: boolean;
}

export class SpectatorResponseDto {
  @ApiProperty({ description: 'Spectator token' })
  spectatorToken: string;

  @ApiProperty({ description: 'Can interact' })
  canInteract: boolean;

  @ApiProperty({ description: 'View only' })
  viewOnly: boolean;
}

export class SpectatorsResponseDto {
  @ApiProperty({ description: 'Spectators list', type: [Object] })
  spectators: {
    playerId: number;
    username: string;
    joinedAt: Date;
    canChat: boolean;
  }[];

  @ApiProperty({ description: 'Total spectators' })
  total: number;
}

export class GameEndCheckResponseDto {
  @ApiProperty({ description: 'Should end game' })
  shouldEnd: boolean;

  @ApiPropertyOptional({ description: 'Winner info', type: Object })
  winner?: {
    playerId: number;
    username: string;
    totalAssets: number;
    rank: number;
  };

  @ApiProperty({ description: 'Final standings', type: [Object] })
  finalStandings: any[];
}

export class SaveResultsResponseDto {
  @ApiProperty({ description: 'Saved status' })
  saved: boolean;

  @ApiProperty({ description: 'Game ID' })
  gameId: string;

  @ApiProperty({ description: 'Rewards assigned' })
  rewardsAssigned: boolean;
}

export class DetailedStateResponseDto {
  @ApiProperty({ description: 'Game state', type: Object })
  gameState: any;

  @ApiProperty({ description: 'Spectators', type: [Object] })
  spectators: any[];

  @ApiProperty({ description: 'Recent history', type: [Object] })
  recentHistory: any[];

  @ApiProperty({ description: 'Market status', type: Object })
  marketStatus: any;
}

export class GameStatsResponseDto {
  @ApiProperty({ description: 'Players stats', type: [Object] })
  players: {
    playerId: number;
    username: string;
    money: number;
    properties: number;
    totalAssets: number;
    rank: number;
    isBankrupt: boolean;
    isSpectator: boolean;
  }[];

  @ApiProperty({ description: 'Market stats', type: Object })
  market: {
    totalPropertiesInPlay: number;
    totalMortgaged: number;
    averagePropertyValue: number;
  };

  @ApiProperty({ description: 'Game stats', type: Object })
  game: {
    currentTurn: number;
    timeRemaining: number;
    activePlayers: number;
    spectators: number;
  };
}

// Card Drawing DTOs
export class DrawCardDto {
  @ApiProperty({ description: 'Game ID' })
  @IsString()
  @IsNotEmpty()
  gameId: string;

  @ApiProperty({ description: 'Player ID' })
  @IsNumber()
  playerId: number;

  @ApiProperty({ description: 'Card type', enum: ['chance', 'chest'] })
  @IsString()
  @IsNotEmpty()
  cardType: 'chance' | 'chest';
}

export class CardDrawResponseDto {
  @ApiProperty({ description: 'Card type' })
  cardType: 'chance' | 'chest';

  @ApiProperty({ description: 'Card drawn', type: Object })
  card: any;

  @ApiProperty({ description: 'Draw result', type: Object })
  result: {
    type: 'money' | 'move' | 'jail' | 'property' | 'none';
    amount?: number;
    newPosition?: number;
    message: string;
  };

  @ApiProperty({ description: 'Updated game state', type: Object })
  game: any;

  @ApiProperty({ description: 'Success message' })
  message: string;
}
