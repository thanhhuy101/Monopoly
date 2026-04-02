// API service for game endpoints
import { ApiError } from './authApi';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

// Request Types
export interface RollDiceRequest {
  gameId: string;
  playerId: number;
}

export interface BuyPropertyRequest {
  gameId: string;
  playerId: number;
  propertyId: string;
}

export interface BuildHouseRequest {
  gameId: string;
  playerId: number;
  propertyId: string;
}

export interface MortgagePropertyRequest {
  gameId: string;
  playerId: number;
  propertyId: string;
}

export interface TradeRequest {
  gameId: string;
  fromPlayerId: number;
  toPlayerId: number;
  properties: string[];
  amount: number;
}

export interface EndTurnRequest {
  gameId: string;
}

export interface FinishGameRequest {
  gameId: string;
  winnerId: number;
}

export interface UpdatePlayerStatusRequest {
  gameId: string;
  userId: string;
  status: 'online' | 'offline' | 'disconnected';
}

// Bankruptcy Request Types
export interface CheckBankruptcyRequest {
  gameId: string;
  playerId: number;
}

export interface BankruptcyFlowRequest {
  gameId: string;
  playerId: number;
  debtAmount: number;
}

export interface LiquidateAssetsRequest {
  gameId: string;
  playerId: number;
  assetsToLiquidate: {
    propertyId: string;
    action: 'sell_house' | 'sell_deed' | 'mortgage';
  }[];
}

export interface DebtTradeRequest {
  gameId: string;
  playerId: number;
  tradePartnerId: number;
  offeredAssets: {
    propertyId: string;
    type: 'property' | 'cash';
  }[];
  requestedAmount: number;
}

export interface EliminatePlayerRequest {
  gameId: string;
  playerId: number;
  reason: 'bankruptcy' | 'disconnect' | 'quit';
}

// Spectator Request Types
export interface SpectateRequest {
  gameId: string;
  playerId: number;
}

export interface LeaveSpectatorRequest {
  gameId: string;
  playerId: number;
  spectatorToken: string;
}

// Game Completion Request Types
export interface SaveResultsRequest {
  gameId: string;
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

// Card Drawing Request Types
export interface DrawCardRequest {
  gameId: string;
  playerId: number;
  cardType: 'chance' | 'chest';
}

// Card Drawing Response Types
export interface CardDrawResponse {
  cardType: 'chance' | 'chest';
  card: any;
  result: {
    type: 'money' | 'move' | 'jail' | 'property' | 'none';
    amount?: number;
    newPosition?: number;
    message: string;
  };
  game: any;
  message: string;
}

// Query Types
export interface DetailedStateQuery {
  includeSpectators?: boolean;
  includeHistory?: boolean;
  includeTransactions?: boolean;
}

// Response Types
export interface GameStateResponse {
  gameState: any;
  message?: string;
}

export interface RollDiceResponse {
  dice: [number, number];
  game: any;
}

export interface GameActionResponse {
  game: any;
  message: string;
}

export interface GameHistoryResponse {
  history: any[];
  total: number;
}

export interface BankruptcyCheckResponse {
  isBankrupt: boolean;
  debtAmount: number;
  canRecover: boolean;
  suggestedActions: string[];
}

export interface BankruptcyFlowResponse {
  flowId: string;
  liquidationOptions: any[];
  tradeOptions: any[];
  timeLimit: number;
}

export interface LiquidationResponse {
  totalRecovered: number;
  remainingDebt: number;
  success: boolean;
}

export interface DebtTradeResponse {
  tradeId: string;
  status: 'pending' | 'accepted' | 'rejected';
  expiresAt: Date;
}

export interface EliminationResponse {
  eliminated: boolean;
  finalRank: number;
  spectatorMode: boolean;
}

export interface SpectatorResponse {
  spectatorToken: string;
  canInteract: boolean;
  viewOnly: boolean;
}

export interface SpectatorsResponse {
  spectators: {
    playerId: number;
    username: string;
    joinedAt: Date;
    canChat: boolean;
  }[];
  total: number;
}

export interface GameEndCheckResponse {
  shouldEnd: boolean;
  winner?: {
    playerId: number;
    username: string;
    totalAssets: number;
    rank: number;
  };
  finalStandings: any[];
}

export interface SaveResultsResponse {
  saved: boolean;
  gameId: string;
  rewardsAssigned: boolean;
}

export interface DetailedStateResponse {
  gameState: any;
  spectators: any[];
  recentHistory: any[];
  marketStatus: any;
}

export interface GameStatsResponse {
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
  market: {
    totalPropertiesInPlay: number;
    totalMortgaged: number;
    averagePropertyValue: number;
  };
  game: {
    currentTurn: number;
    timeRemaining: number;
    activePlayers: number;
    spectators: number;
  };
}

class GameApiService {
  private getHeaders(includeAuth: boolean = false): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0',
    };

    if (includeAuth) {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(true),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.message || 'Request failed',
          response.status,
          data.error
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error occurred');
    }
  }

  // Core Game Actions
  async startGame(roomId: string): Promise<GameActionResponse> {
    return this.request<GameActionResponse>(`/game/${roomId}/start`, {
      method: 'POST',
    });
  }

  async getGameState(roomId: string): Promise<GameStateResponse> {
    return this.request<GameStateResponse>(`/game/${roomId}/state`, {
      method: 'GET',
    });
  }

  async rollDice(request: RollDiceRequest): Promise<RollDiceResponse> {
    return this.request<RollDiceResponse>(`/game/${request.gameId}/roll`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async buyProperty(request: BuyPropertyRequest): Promise<GameActionResponse> {
    return this.request<GameActionResponse>(`/game/${request.gameId}/buy`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async buildHouse(request: BuildHouseRequest): Promise<GameActionResponse> {
    return this.request<GameActionResponse>(`/game/${request.gameId}/build`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async mortgageProperty(request: MortgagePropertyRequest): Promise<GameActionResponse> {
    return this.request<GameActionResponse>(`/game/${request.gameId}/mortgage`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async trade(request: TradeRequest): Promise<GameActionResponse> {
    return this.request<GameActionResponse>(`/game/${request.gameId}/trade`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async endTurn(request: EndTurnRequest): Promise<GameActionResponse> {
    return this.request<GameActionResponse>(`/game/${request.gameId}/end-turn`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async finishGame(request: FinishGameRequest): Promise<GameActionResponse> {
    return this.request<GameActionResponse>(`/game/${request.gameId}/finish`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async updatePlayerStatus(request: UpdatePlayerStatusRequest): Promise<GameActionResponse> {
    return this.request<GameActionResponse>(`/game/${request.gameId}/player-status`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
  }

  async getGameHistory(roomId: string): Promise<GameHistoryResponse> {
    return this.request<GameHistoryResponse>(`/game/${roomId}/history`, {
      method: 'GET',
    });
  }

  // Bankruptcy APIs
  async checkBankruptcy(request: CheckBankruptcyRequest): Promise<BankruptcyCheckResponse> {
    return this.request<BankruptcyCheckResponse>(`/game/${request.gameId}/check-bankruptcy`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async startBankruptcyFlow(request: BankruptcyFlowRequest): Promise<BankruptcyFlowResponse> {
    return this.request<BankruptcyFlowResponse>(`/game/${request.gameId}/bankruptcy-flow`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async liquidateAssets(request: LiquidateAssetsRequest): Promise<LiquidationResponse> {
    return this.request<LiquidationResponse>(`/game/${request.gameId}/liquidate-assets`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async eliminatePlayer(request: EliminatePlayerRequest): Promise<EliminationResponse> {
    return this.request<EliminationResponse>(`/game/${request.gameId}/eliminate-player`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async createDebtTrade(request: DebtTradeRequest): Promise<DebtTradeResponse> {
    return this.request<DebtTradeResponse>(`/game/${request.gameId}/debt-trade`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Spectator APIs
  async spectateGame(request: SpectateRequest): Promise<SpectatorResponse> {
    return this.request<SpectatorResponse>(`/game/${request.gameId}/spectate`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async leaveSpectateRoom(request: LeaveSpectatorRequest): Promise<{ left: boolean; redirectUrl?: string }> {
    return this.request<{ left: boolean; redirectUrl?: string }>(`/game/${request.gameId}/leave-spectate`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getSpectators(roomId: string): Promise<SpectatorsResponse> {
    return this.request<SpectatorsResponse>(`/game/${roomId}/spectators`, {
      method: 'GET',
    });
  }

  // Game Maintenance & Reporting
  async checkGameEnd(roomId: string): Promise<GameEndCheckResponse> {
    return this.request<GameEndCheckResponse>(`/game/${roomId}/check-end`, {
      method: 'GET',
    });
  }

  async saveGameResults(request: SaveResultsRequest): Promise<SaveResultsResponse> {
    return this.request<SaveResultsResponse>(`/game/${request.gameId}/save-results`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getDetailedGameState(roomId: string, query?: DetailedStateQuery): Promise<DetailedStateResponse> {
    const queryParams = new URLSearchParams();
    if (query?.includeSpectators) queryParams.append('includeSpectators', 'true');
    if (query?.includeHistory) queryParams.append('includeHistory', 'true');
    if (query?.includeTransactions) queryParams.append('includeTransactions', 'true');
    
    const queryString = queryParams.toString();
    const url = `/game/${roomId}/detailed-state${queryString ? `?${queryString}` : ''}`;
    
    return this.request<DetailedStateResponse>(url, {
      method: 'GET',
    });
  }

  async getGameStats(roomId: string): Promise<GameStatsResponse> {
    return this.request<GameStatsResponse>(`/game/${roomId}/stats`, {
      method: 'GET',
    });
  }

  // Card drawing methods
  async drawCard(request: DrawCardRequest): Promise<CardDrawResponse> {
    return this.request<CardDrawResponse>(`/game/${request.gameId}/draw-card`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }
}

export const gameApi = new GameApiService();
export default gameApi;
