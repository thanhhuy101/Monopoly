import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GameUseCase } from '../application/usecases/game.usecase';
import {
  StartGameDto,
  RollDiceDto,
  BuyPropertyDto,
  BuildHouseDto,
  MortgagePropertyDto,
  TradeDto,
  EndTurnDto,
  FinishGameDto,
  GetGameStateDto,
  UpdatePlayerStatusDto,
  GameStateResponseDto,
  RollDiceResponseDto,
  GameActionResponseDto,
  GameHistoryResponseDto,
  // New DTOs for bankruptcy APIs
  CheckBankruptcyDto,
  BankruptcyFlowDto,
  LiquidateAssetsDto,
  DebtTradeDto,
  EliminatePlayerDto,
  BankruptcyCheckResponseDto,
  BankruptcyFlowResponseDto,
  LiquidationResponseDto,
  DebtTradeResponseDto,
  EliminationResponseDto,
  SpectateDto,
  LeaveSpectatorDto,
  SpectatorResponseDto,
  SpectatorsResponseDto,
  CheckGameEndDto,
  GameEndCheckResponseDto,
  SaveResultsDto,
  SaveResultsResponseDto,
  DetailedStateQueryDto,
  DetailedStateResponseDto,
  GameStatsResponseDto,
  // New DTOs for card drawing
  DrawCardDto,
  CardDrawResponseDto,
} from './dto/game.dto';

@ApiTags('game')
@Controller('game')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GameController {
  constructor(private readonly gameUseCase: GameUseCase) {}

  @Post(':roomId/start')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Start a new game in a room' })
  @ApiResponse({ status: 200, description: 'Game started successfully', type: GameActionResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  async startGame(@Param('roomId') roomId: string): Promise<GameActionResponseDto> {
    const game = await this.gameUseCase.startGame(roomId);
    return {
      game,
      message: 'Game started successfully',
    };
  }

  @Get(':roomId/state')
  @ApiOperation({ summary: 'Get current game state' })
  @ApiResponse({ status: 200, description: 'Game state retrieved successfully', type: GameStateResponseDto })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async getGameState(@Param('roomId') roomId: string): Promise<GameStateResponseDto> {
    const gameState = await this.gameUseCase.getGameState(roomId);
    return {
      gameState,
    };
  }

  @Get(':roomId/stats')
  @ApiOperation({ summary: 'Get game statistics' })
  @ApiResponse({ status: 200, description: 'Game stats retrieved successfully', type: GameStatsResponseDto })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async getGameStats(@Param('roomId') roomId: string): Promise<GameStatsResponseDto> {
    const result = await this.gameUseCase.getGameStats(roomId);
    return result;
  }

  @Post(':roomId/roll')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Roll dice for current player' })
  @ApiResponse({ status: 200, description: 'Dice rolled successfully', type: RollDiceResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async rollDice(@Body() rollDiceDto: RollDiceDto): Promise<RollDiceResponseDto> {
    const result = await this.gameUseCase.rollDice(rollDiceDto.gameId, rollDiceDto.playerId);
    return result;
  }

  @Post(':roomId/buy')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buy property for current player' })
  @ApiResponse({ status: 200, description: 'Property purchased successfully', type: GameActionResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async buyProperty(@Body() buyPropertyDto: BuyPropertyDto): Promise<GameActionResponseDto> {
    const game = await this.gameUseCase.buyProperty(
      buyPropertyDto.gameId,
      buyPropertyDto.playerId,
      buyPropertyDto.propertyId,
    );
    return {
      game,
      message: 'Property purchased successfully',
    };
  }

  @Post(':roomId/build')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Build house on property' })
  @ApiResponse({ status: 200, description: 'House built successfully', type: GameActionResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async buildHouse(@Body() buildHouseDto: BuildHouseDto): Promise<GameActionResponseDto> {
    const game = await this.gameUseCase.buildHouse(
      buildHouseDto.gameId,
      buildHouseDto.playerId,
      buildHouseDto.propertyId,
    );
    return {
      game,
      message: 'House built successfully',
    };
  }

  @Post(':roomId/mortgage')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mortgage property' })
  @ApiResponse({ status: 200, description: 'Property mortgaged successfully', type: GameActionResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async mortgageProperty(@Body() mortgagePropertyDto: MortgagePropertyDto): Promise<GameActionResponseDto> {
    const game = await this.gameUseCase.mortgageProperty(
      mortgagePropertyDto.gameId,
      mortgagePropertyDto.playerId,
      mortgagePropertyDto.propertyId,
    );
    return {
      game,
      message: 'Property mortgaged successfully',
    };
  }

  @Post(':roomId/trade')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Trade properties between players' })
  @ApiResponse({ status: 200, description: 'Trade completed successfully', type: GameActionResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async trade(@Body() tradeDto: TradeDto): Promise<GameActionResponseDto> {
    const game = await this.gameUseCase.trade(
      tradeDto.gameId,
      tradeDto.fromPlayerId,
      tradeDto.toPlayerId,
      tradeDto.properties,
      tradeDto.amount,
    );
    return {
      game,
      message: 'Trade completed successfully',
    };
  }

  @Post(':roomId/end-turn')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'End current player turn' })
  @ApiResponse({ status: 200, description: 'Turn ended successfully', type: GameActionResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async endTurn(@Body() endTurnDto: EndTurnDto): Promise<GameActionResponseDto> {
    const game = await this.gameUseCase.endTurn(endTurnDto.gameId);
    return {
      game,
      message: 'Turn ended successfully',
    };
  }

  @Post(':roomId/finish')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Finish game and declare winner' })
  @ApiResponse({ status: 200, description: 'Game finished successfully', type: GameActionResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async finishGame(@Body() finishGameDto: FinishGameDto): Promise<GameActionResponseDto> {
    const game = await this.gameUseCase.finishGame(finishGameDto.gameId);
    return {
      game,
      message: 'Game finished successfully',
    };
  }

  @Put(':roomId/player-status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update player status' })
  @ApiResponse({ status: 200, description: 'Player status updated successfully', type: GameActionResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async updatePlayerStatus(@Body() updatePlayerStatusDto: UpdatePlayerStatusDto): Promise<GameActionResponseDto> {
    await this.gameUseCase.updatePlayerStatus(
      updatePlayerStatusDto.gameId,
      updatePlayerStatusDto.userId,
      updatePlayerStatusDto.status,
    );
    
    return {
      game: null,
      message: 'Player status updated successfully',
    };
  }

  @Get(':roomId/history')
  @ApiOperation({ summary: 'Get game history for a room' })
  @ApiResponse({ status: 200, description: 'Game history retrieved successfully', type: GameHistoryResponseDto })
  @ApiResponse({ status: 404, description: 'Room not found' })
  async getGameHistory(@Param('roomId') roomId: string): Promise<GameHistoryResponseDto> {
    // This would need to be implemented in the use case
    // For now, returning empty array as placeholder
    return {
      history: [],
      total: 0,
    };
  }

  // Phase 1: Bankruptcy APIs
  @Post(':roomId/check-bankruptcy')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check if player is bankrupt' })
  @ApiResponse({ status: 200, description: 'Bankruptcy check completed', type: BankruptcyCheckResponseDto })
  @ApiResponse({ status: 404, description: 'Game or player not found' })
  async checkBankruptcy(@Body() checkBankruptcyDto: CheckBankruptcyDto): Promise<BankruptcyCheckResponseDto> {
    const result = await this.gameUseCase.checkBankruptcy(checkBankruptcyDto.gameId, checkBankruptcyDto.playerId);
    return result;
  }

  @Post(':roomId/bankruptcy-flow')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Start bankruptcy flow for player' })
  @ApiResponse({ status: 200, description: 'Bankruptcy flow started', type: BankruptcyFlowResponseDto })
  @ApiResponse({ status: 404, description: 'Game or player not found' })
  async startBankruptcyFlow(@Body() bankruptcyFlowDto: BankruptcyFlowDto): Promise<BankruptcyFlowResponseDto> {
    const result = await this.gameUseCase.startBankruptcyFlow(
      bankruptcyFlowDto.gameId,
      bankruptcyFlowDto.playerId,
      bankruptcyFlowDto.debtAmount
    );
    return result;
  }

  @Post(':roomId/liquidate-assets')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Liquidate player assets to cover debt' })
  @ApiResponse({ status: 200, description: 'Assets liquidated successfully', type: LiquidationResponseDto })
  @ApiResponse({ status: 404, description: 'Game or player not found' })
  async liquidateAssets(@Body() liquidateAssetsDto: LiquidateAssetsDto): Promise<LiquidationResponseDto> {
    const result = await this.gameUseCase.liquidateAssets(
      liquidateAssetsDto.gameId,
      liquidateAssetsDto.playerId,
      liquidateAssetsDto.assetsToLiquidate
    );
    return result;
  }

  @Post(':roomId/eliminate-player')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminate player from game' })
  @ApiResponse({ status: 200, description: 'Player eliminated successfully', type: EliminationResponseDto })
  @ApiResponse({ status: 404, description: 'Game or player not found' })
  async eliminatePlayer(@Body() eliminatePlayerDto: EliminatePlayerDto): Promise<EliminationResponseDto> {
    const result = await this.gameUseCase.eliminatePlayer(
      eliminatePlayerDto.gameId,
      eliminatePlayerDto.playerId,
      eliminatePlayerDto.reason
    );
    return result;
  }

  @Post(':roomId/debt-trade')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a debt trade request' })
  @ApiResponse({ status: 200, description: 'Debt trade request created', type: DebtTradeResponseDto })
  async createDebtTrade(@Body() debtTradeDto: DebtTradeDto): Promise<DebtTradeResponseDto> {
    const result = await this.gameUseCase.createDebtTrade(
      debtTradeDto.gameId,
      debtTradeDto.playerId,
      debtTradeDto.tradePartnerId,
      debtTradeDto.offeredAssets,
      debtTradeDto.requestedAmount
    );
    return result;
  }

  // Spectator Endpoints
  @Post(':roomId/spectate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Join game as a spectator' })
  @ApiResponse({ status: 200, description: 'Joined as spectator', type: SpectatorResponseDto })
  async spectateGame(@Body() spectateDto: SpectateDto): Promise<SpectatorResponseDto> {
    const result = await this.gameUseCase.spectateGame(spectateDto.gameId, spectateDto.playerId);
    return result;
  }

  @Post(':roomId/leave-spectate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Leave spectator mode' })
  @ApiResponse({ status: 200, description: 'Left spectator mode', type: Boolean })
  async leaveSpectateRoom(@Body() leaveSpectatorDto: LeaveSpectatorDto): Promise<{ left: boolean; redirectUrl?: string }> {
    const result = await this.gameUseCase.leaveSpectateRoom(
      leaveSpectatorDto.gameId,
      leaveSpectatorDto.playerId,
      leaveSpectatorDto.spectatorToken
    );
    return result;
  }

  @Get(':roomId/spectators')
  @ApiOperation({ summary: 'Get list of spectators' })
  @ApiResponse({ status: 200, description: 'Spectators retrieved successfully', type: SpectatorsResponseDto })
  async getSpectators(@Param('roomId') roomId: string): Promise<SpectatorsResponseDto> {
    const result = await this.gameUseCase.getSpectators(roomId);
    return result;
  }

  // Game Maintenance & Reporting
  @Get(':roomId/check-end')
  @ApiOperation({ summary: 'Check if game should end' })
  @ApiResponse({ status: 200, description: 'Game end check completed', type: GameEndCheckResponseDto })
  async checkGameEnd(@Param('roomId') roomId: string): Promise<GameEndCheckResponseDto> {
    const result = await this.gameUseCase.checkGameEnd(roomId);
    return result;
  }

  @Post(':roomId/save-results')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Save final game results' })
  @ApiResponse({ status: 200, description: 'Results saved successfully', type: SaveResultsResponseDto })
  async saveGameResults(@Body() saveResultsDto: SaveResultsDto): Promise<SaveResultsResponseDto> {
    const result = await this.gameUseCase.saveGameResults(saveResultsDto.gameId, saveResultsDto.results);
    return result;
  }

  @Get(':roomId/detailed-state')
  @ApiOperation({ summary: 'Get detailed game state including history and spectators' })
  @ApiResponse({ status: 200, description: 'Detailed state retrieved successfully', type: DetailedStateResponseDto })
  async getDetailedGameState(
    @Param('roomId') roomId: string,
    @Query() query: DetailedStateQueryDto
  ): Promise<DetailedStateResponseDto> {
    const result = await this.gameUseCase.getDetailedGameState(roomId, {
      includeSpectators: query.includeSpectators,
      includeHistory: query.includeHistory,
      includeTransactions: query.includeTransactions
    });
    return result;
  }

  // Card Drawing Endpoints
  @Post(':roomId/draw-card')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Draw a Chance or Community Chest card' })
  @ApiResponse({ status: 200, description: 'Card drawn successfully', type: CardDrawResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Game not found' })
  async drawCard(@Body() drawCardDto: DrawCardDto): Promise<CardDrawResponseDto> {
    const result = await this.gameUseCase.drawCard(drawCardDto.gameId, drawCardDto.playerId, drawCardDto.cardType);
    return result;
  }
}
