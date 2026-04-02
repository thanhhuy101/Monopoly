import { useState, useEffect, useCallback } from 'react';
import { gameApi } from '../services/gameApi';
import type {
  RollDiceResponse,
  GameActionResponse,
  BankruptcyCheckResponse,
  BankruptcyFlowResponse,
  LiquidationResponse,
  DebtTradeResponse,
  EliminationResponse,
  SpectatorResponse,
  GameEndCheckResponse,
  SaveResultsResponse,
  DetailedStateResponse,
  RollDiceRequest,
  BuyPropertyRequest,
  BuildHouseRequest,
  MortgagePropertyRequest,
  TradeRequest,
  EndTurnRequest,
  FinishGameRequest,
  UpdatePlayerStatusRequest,
  CheckBankruptcyRequest,
  BankruptcyFlowRequest,
  LiquidateAssetsRequest,
  DebtTradeRequest,
  EliminatePlayerRequest,
  SpectateRequest,
  LeaveSpectatorRequest,
  SaveResultsRequest,
  DetailedStateQuery,
} from '../services/gameApi';
import type { BackendGameState, Spectator, GameStats } from '../types/game';

// Hook for game state management
export const useGameState = (roomId: string | null) => {
  const [gameState, setGameState] = useState<BackendGameState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGameState = useCallback(async () => {
    if (!roomId) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await gameApi.getGameState(roomId);
      setGameState(response.gameState);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch game state');
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    fetchGameState();
  }, [fetchGameState]);

  return {
    gameState,
    loading,
    error,
    refetch: fetchGameState,
  };
};

// Hook for detailed game state
export const useDetailedGameState = (roomId: string | null, query?: DetailedStateQuery) => {
  const [detailedState, setDetailedState] = useState<DetailedStateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetailedState = useCallback(async () => {
    if (!roomId) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await gameApi.getDetailedGameState(roomId, query);
      setDetailedState(response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch detailed game state');
    } finally {
      setLoading(false);
    }
  }, [roomId, query]);

  useEffect(() => {
    fetchDetailedState();
  }, [fetchDetailedState]);

  return {
    detailedState,
    loading,
    error,
    refetch: fetchDetailedState,
  };
};

// Hook for game stats
export const useGameStats = (roomId: string | null) => {
  const [gameStats, setGameStats] = useState<GameStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGameStats = useCallback(async () => {
    if (!roomId) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await gameApi.getGameStats(roomId);
      setGameStats(response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch game stats');
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    fetchGameStats();
  }, [fetchGameStats]);

  return {
    gameStats,
    loading,
    error,
    refetch: fetchGameStats,
  };
};

// Hook for spectators
export const useSpectators = (roomId: string | null) => {
  const [spectators, setSpectators] = useState<Spectator[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSpectators = useCallback(async () => {
    if (!roomId) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await gameApi.getSpectators(roomId);
      setSpectators(response.spectators);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch spectators');
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    fetchSpectators();
  }, [fetchSpectators]);

  return {
    spectators,
    loading,
    error,
    refetch: fetchSpectators,
  };
};

// Hook for game actions
export const useGameActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startGame = async (roomId: string): Promise<GameActionResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await gameApi.startGame(roomId);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to start game');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const rollDice = async (request: RollDiceRequest): Promise<RollDiceResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await gameApi.rollDice(request);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to roll dice');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const buyProperty = async (request: BuyPropertyRequest): Promise<GameActionResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await gameApi.buyProperty(request);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to buy property');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const buildHouse = async (request: BuildHouseRequest): Promise<GameActionResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await gameApi.buildHouse(request);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to build house');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const mortgageProperty = async (request: MortgagePropertyRequest): Promise<GameActionResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await gameApi.mortgageProperty(request);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to mortgage property');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const trade = async (request: TradeRequest): Promise<GameActionResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await gameApi.trade(request);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to complete trade');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const endTurn = async (request: EndTurnRequest): Promise<GameActionResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await gameApi.endTurn(request);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to end turn');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const finishGame = async (request: FinishGameRequest): Promise<GameActionResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await gameApi.finishGame(request);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to finish game');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updatePlayerStatus = async (request: UpdatePlayerStatusRequest): Promise<GameActionResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await gameApi.updatePlayerStatus(request);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to update player status');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    startGame,
    rollDice,
    buyProperty,
    buildHouse,
    mortgageProperty,
    trade,
    endTurn,
    finishGame,
    updatePlayerStatus,
  };
};

// Hook for bankruptcy actions
export const useBankruptcyActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkBankruptcy = async (request: CheckBankruptcyRequest): Promise<BankruptcyCheckResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await gameApi.checkBankruptcy(request);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to check bankruptcy');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const startBankruptcyFlow = async (request: BankruptcyFlowRequest): Promise<BankruptcyFlowResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await gameApi.startBankruptcyFlow(request);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to start bankruptcy flow');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const liquidateAssets = async (request: LiquidateAssetsRequest): Promise<LiquidationResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await gameApi.liquidateAssets(request);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to liquidate assets');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const eliminatePlayer = async (request: EliminatePlayerRequest): Promise<EliminationResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await gameApi.eliminatePlayer(request);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to eliminate player');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createDebtTrade = async (request: DebtTradeRequest): Promise<DebtTradeResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await gameApi.createDebtTrade(request);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to create debt trade');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    checkBankruptcy,
    startBankruptcyFlow,
    liquidateAssets,
    eliminatePlayer,
    createDebtTrade,
  };
};

// Hook for spectator actions
export const useSpectatorActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const spectateGame = async (request: SpectateRequest): Promise<SpectatorResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await gameApi.spectateGame(request);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to spectate game');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const leaveSpectateRoom = async (request: LeaveSpectatorRequest): Promise<{ left: boolean; redirectUrl?: string } | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await gameApi.leaveSpectateRoom(request);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to leave spectator room');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    spectateGame,
    leaveSpectateRoom,
  };
};

// Hook for game completion
export const useGameCompletion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkGameEnd = async (roomId: string): Promise<GameEndCheckResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await gameApi.checkGameEnd(roomId);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to check game end');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const saveGameResults = async (request: SaveResultsRequest): Promise<SaveResultsResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await gameApi.saveGameResults(request);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to save game results');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    checkGameEnd,
    saveGameResults,
  };
};
