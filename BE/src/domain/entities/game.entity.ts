export interface JailStatus {
  inJail: boolean;
  turns: number;
}

export interface Player {
  id: number;
  uid: string;
  username: string;
  emoji: string;
  money: number;
  position: number;
  properties: string[];
  jailStatus: JailStatus;
  bankrupt: boolean;
  isCurrentTurn: boolean;
  lastAction?: string;
  isSpectator?: boolean;
  eliminatedAt?: Date;
  finalRank?: number;
}

export interface Spectator {
  playerId: number;
  username: string;
  joinedAt: Date;
  lastActive: Date;
  permissions: {
    canChat: boolean;
    canViewHistory: boolean;
    canViewTransactions: boolean;
  };
  isActive: boolean;
}

export interface BankruptcyRecord {
  gameId: string;
  playerId: number;
  triggeredAt: Date;
  debtAmount: number;
  assetsAtTime: {
    properties: string[];
    cash: number;
    totalValue: number;
  };
  resolution: {
    type: 'liquidated' | 'traded' | 'eliminated';
    recoveredAmount?: number;
    eliminatedAt?: Date;
    finalRank?: number;
  };
  liquidationDetails?: {
    soldProperties: string[];
    mortgagedProperties: string[];
    totalRecovered: number;
  };
}

export interface TransactionRecord {
  id: string;
  gameId: string;
  playerId: number;
  type: 'buy' | 'sell' | 'trade' | 'mortgage' | 'bankruptcy' | 'liquidation' | 'elimination';
  amount: number;
  description: string;
  relatedPlayers?: number[];
  relatedProperties?: string[];
  metadata?: {
    tradeId?: string;
    bankruptcyId?: string;
    liquidationId?: string;
  };
  timestamp: Date;
}

export interface PropertyState {
  ownerId?: string;
  houses: number;
  isMortgaged: boolean;
}

export interface BoardState {
  properties: Record<string, PropertyState>;
  houses: Record<string, number>;
  mortgages: Record<string, boolean>;
}

export interface GameSettings {
  turnTimeLimit: number;
  autoRoll: boolean;
  startingMoney: number;
}

export interface GameLog {
  timestamp: Date;
  message: string;
  playerId?: number;
  type: 'action' | 'system' | 'trade' | 'property';
}

export interface CardDrawResult {
  cardType: 'chance' | 'chest';
  card: any;
  playerId: number;
  result: {
    type: 'money' | 'move' | 'jail' | 'property' | 'none';
    amount?: number;
    newPosition?: number;
    message: string;
  };
}

export interface DeckState {
  chanceDeck: number[];
  chestDeck: number[];
  discardPile: {
    chance: number[];
    chest: number[];
  };
}

export interface GameState {
  id: string;
  roomId: string;
  players: Player[];
  currentPlayer: number;
  phase: 'waiting' | 'playing' | 'finished';
  dice: [number, number] | null;
  board: BoardState;
  log: GameLog[];
  settings: GameSettings;
  createdAt: Date;
  lastUpdated: Date;
  winner?: number;
  deckState: DeckState;
}

export interface GameSession {
  _id: string;
  roomId: string;
  gameState: GameState;
  players: {
    userId: string;
    status: 'online' | 'offline' | 'disconnected';
    lastSeen: Date;
  }[];
}

export interface GameHistory {
  _id: string;
  roomId: string;
  sessionId: string;
  players: {
    uid: string;
    finalPosition: number;
    finalMoney: number;
    propertiesOwned: string[];
    isWinner: boolean;
  }[];
  gameData: {
    duration: number;
    totalTurns: number;
    finalBoardState: Record<string, any>;
  };
  playedAt: Date;
}

export class Game {
  constructor(
    public readonly id: string,
    public readonly roomId: string,
    public readonly players: Player[],
    public readonly settings: GameSettings,
    public readonly board: BoardState,
    public readonly phase: 'waiting' | 'playing' | 'finished' = 'waiting',
    public readonly currentPlayer: number = 0,
    public readonly dice: [number, number] | null = null,
    public readonly log: GameLog[] = [],
    public readonly createdAt: Date = new Date(),
    public readonly lastUpdated: Date = new Date(),
    public readonly winner?: number,
    public readonly deckState: DeckState = {
      chanceDeck: [],
      chestDeck: [],
      discardPile: { chance: [], chest: [] }
    }
  ) {}

  get gameState(): GameState {
    return {
      id: this.id,
      roomId: this.roomId,
      players: this.players,
      currentPlayer: this.currentPlayer,
      phase: this.phase,
      dice: this.dice,
      board: this.board,
      log: this.log,
      settings: this.settings,
      createdAt: this.createdAt,
      lastUpdated: this.lastUpdated,
      winner: this.winner,
      deckState: this.deckState
    };
  }

  static create(roomId: string, players: Player[], settings: GameSettings): Game {
    const board: BoardState = {
      properties: {},
      houses: {},
      mortgages: {}
    };

    // Initialize decks
    const { createShuffledDeck } = require('../../data/gameData');
    const deckState: DeckState = {
      chanceDeck: createShuffledDeck(16), // 16 chance cards
      chestDeck: createShuffledDeck(17), // 17 chest cards
      discardPile: { chance: [], chest: [] }
    };

    return new Game(
      `game_${roomId}_${Date.now()}`,
      roomId,
      players,
      settings,
      board,
      'waiting',
      0,
      null,
      [],
      new Date(),
      new Date(),
      undefined,
      deckState
    );
  }

  startGame(): Game {
    if (this.phase !== 'waiting') {
      throw new Error('Game is already in progress');
    }

    if (this.players.length < 2) {
      throw new Error('Not enough players to start the game');
    }

    return new Game(
      this.id,
      this.roomId,
      this.players.map(player => ({
        ...player,
        money: this.settings.startingMoney,
        position: 0,
        properties: [],
        jailStatus: { inJail: false, turns: 0 },
        bankrupt: false,
        isCurrentTurn: player.id === this.currentPlayer
      })),
      this.settings,
      this.board,
      'playing',
      0,
      null,
      [...this.log, {
        timestamp: new Date(),
        message: 'Game started',
        type: 'system'
      }],
      this.createdAt,
      new Date()
    );
  }

  rollDice(playerId: number): [number, number] {
    if (this.phase !== 'playing') {
      throw new Error('Game is not in playing phase');
    }

    const currentPlayer = this.players[this.currentPlayer];
    if (currentPlayer.id !== playerId) {
      throw new Error('Not your turn');
    }

    const dice: [number, number] = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1
    ];

    return dice;
  }

  movePlayer(playerId: number, steps: number): Game {
    const playerIndex = this.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) {
      throw new Error('Player not found');
    }

    const player = this.players[playerIndex];
    const newPosition = (player.position + steps) % 40;

    const updatedPlayers = [...this.players];
    updatedPlayers[playerIndex] = {
      ...player,
      position: newPosition,
      lastAction: `Moved ${steps} spaces to position ${newPosition}`
    };

    return new Game(
      this.id,
      this.roomId,
      updatedPlayers,
      this.settings,
      this.board,
      this.phase,
      this.currentPlayer,
      this.dice,
      [...this.log, {
        timestamp: new Date(),
        message: `${player.username} moved to position ${newPosition}`,
        playerId,
        type: 'action'
      }],
      this.createdAt,
      new Date(),
      this.winner
    );
  }

  buyProperty(playerId: number, propertyId: string, cost: number): Game {
    const playerIndex = this.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) {
      throw new Error('Player not found');
    }

    const player = this.players[playerIndex];
    if (player.money < cost) {
      throw new Error('Not enough money to buy property');
    }

    const updatedPlayers = [...this.players];
    updatedPlayers[playerIndex] = {
      ...player,
      money: player.money - cost,
      properties: [...player.properties, propertyId],
      lastAction: `Bought property ${propertyId}`
    };

    const updatedProperties = {
      ...this.board.properties,
      [propertyId]: {
        ownerId: player.uid,
        houses: 0,
        isMortgaged: false
      }
    };

    const updatedBoard = {
      ...this.board,
      properties: updatedProperties
    };

    return new Game(
      this.id,
      this.roomId,
      updatedPlayers,
      this.settings,
      updatedBoard,
      this.phase,
      this.currentPlayer,
      this.dice,
      [...this.log, {
        timestamp: new Date(),
        message: `${player.username} bought property ${propertyId}`,
        playerId,
        type: 'property'
      }],
      this.createdAt,
      new Date(),
      this.winner
    );
  }

  endTurn(): Game {
    if (this.phase !== 'playing') {
      throw new Error('Game is not in playing phase');
    }

    const nextPlayerIndex = (this.currentPlayer + 1) % this.players.length;
    
    const updatedPlayers = this.players.map((player, index) => ({
      ...player,
      isCurrentTurn: index === nextPlayerIndex
    }));

    return new Game(
      this.id,
      this.roomId,
      updatedPlayers,
      this.settings,
      this.board,
      this.phase,
      nextPlayerIndex,
      null,
      [...this.log, {
        timestamp: new Date(),
        message: `Turn ended. Next player: ${this.players[nextPlayerIndex].username}`,
        type: 'system'
      }],
      this.createdAt,
      new Date(),
      this.winner
    );
  }

  checkWinner(): number | null {
    const activePlayers = this.players.filter(p => !p.bankrupt);
    
    if (activePlayers.length === 1) {
      return activePlayers[0].id;
    }

    return null;
  }

  finishGame(winnerId: number): Game {
    return new Game(
      this.id,
      this.roomId,
      this.players,
      this.settings,
      this.board,
      'finished',
      this.currentPlayer,
      this.dice,
      [...this.log, {
        timestamp: new Date(),
        message: `Game finished. Winner: ${this.players.find(p => p.id === winnerId)?.username}`,
        type: 'system'
      }],
      this.createdAt,
      new Date(),
      winnerId
    );
  }

  // New methods for bankruptcy and elimination
  checkBankruptcy(playerId: number): { isBankrupt: boolean; debtAmount: number; canRecover: boolean } {
    const player = this.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    const totalAssets = player.money + this.calculatePropertyValue(player.properties);
    const debtAmount = Math.max(0, -player.money); // Money owed to bank/other players
    
    const isBankrupt = player.money < 0 && totalAssets < Math.abs(debtAmount);
    const canRecover = totalAssets >= Math.abs(debtAmount);

    return { isBankrupt, debtAmount, canRecover };
  }

  eliminatePlayer(playerId: number, reason: 'bankruptcy' | 'disconnect' | 'quit'): Game {
    const playerIndex = this.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) {
      throw new Error('Player not found');
    }

    const updatedPlayers = [...this.players];
    updatedPlayers[playerIndex] = {
      ...updatedPlayers[playerIndex],
      bankrupt: true,
      eliminatedAt: new Date(),
      finalRank: this.players.filter(p => !p.bankrupt).length + 1,
      isCurrentTurn: false
    };

    // If it was the eliminated player's turn, move to next player
    let nextPlayerIndex = this.currentPlayer;
    if (this.currentPlayer === playerIndex) {
      do {
        nextPlayerIndex = (nextPlayerIndex + 1) % this.players.length;
      } while (updatedPlayers[nextPlayerIndex].bankrupt);
    }

    return new Game(
      this.id,
      this.roomId,
      updatedPlayers,
      this.settings,
      this.board,
      this.phase,
      nextPlayerIndex,
      this.dice,
      [...this.log, {
        timestamp: new Date(),
        message: `${updatedPlayers[playerIndex].username} eliminated (${reason})`,
        playerId,
        type: 'system'
      }],
      this.createdAt,
      new Date(),
      this.winner
    );
  }

  liquidateAssets(playerId: number, assetsToLiquidate: { propertyId: string; action: 'sell_house' | 'sell_deed' | 'mortgage' }[]): { totalRecovered: number; remainingDebt: number; success: boolean } {
    const player = this.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    let totalRecovered = 0;
    const updatedBoard = { ...this.board };
    const updatedPlayers = [...this.players];
    const playerIndex = this.players.findIndex(p => p.id === playerId);

    for (const asset of assetsToLiquidate) {
      const property = this.board.properties[asset.propertyId];
      if (!property || property.ownerId !== player.uid) {
        continue;
      }

      let recoveredAmount = 0;
      
      switch (asset.action) {
        case 'sell_house':
          recoveredAmount = this.getHousePrice(asset.propertyId) * property.houses;
          updatedBoard.properties[asset.propertyId] = {
            ...property,
            houses: 0
          };
          break;
          
        case 'sell_deed':
          recoveredAmount = this.getPropertyPrice(asset.propertyId);
          delete updatedBoard.properties[asset.propertyId];
          updatedPlayers[playerIndex] = {
            ...updatedPlayers[playerIndex],
            properties: updatedPlayers[playerIndex].properties.filter(p => p !== asset.propertyId)
          };
          break;
          
        case 'mortgage':
          recoveredAmount = Math.floor(this.getPropertyPrice(asset.propertyId) * 0.5);
          updatedBoard.properties[asset.propertyId] = {
            ...property,
            isMortgaged: true,
            houses: 0
          };
          break;
      }

      totalRecovered += recoveredAmount;
    }

    updatedPlayers[playerIndex] = {
      ...updatedPlayers[playerIndex],
      money: updatedPlayers[playerIndex].money + totalRecovered
    };

    const debtAmount = Math.max(0, -player.money);
    const remainingDebt = Math.max(0, debtAmount - totalRecovered);
    const success = remainingDebt === 0;

    // Update the game instance
    Object.assign(this, {
      players: updatedPlayers,
      board: updatedBoard,
      lastUpdated: new Date(),
      log: [...this.log, {
        timestamp: new Date(),
        message: `${player.username} liquidated assets for $${totalRecovered}`,
        playerId,
        type: 'action'
      }]
    });

    return { totalRecovered, remainingDebt, success };
  }

  convertToSpectator(playerId: number): Game {
    const playerIndex = this.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) {
      throw new Error('Player not found');
    }

    const updatedPlayers = [...this.players];
    updatedPlayers[playerIndex] = {
      ...updatedPlayers[playerIndex],
      isSpectator: true,
      bankrupt: true,
      eliminatedAt: new Date(),
      isCurrentTurn: false
    };

    // Move to next player if it was this player's turn
    let nextPlayerIndex = this.currentPlayer;
    if (this.currentPlayer === playerIndex) {
      do {
        nextPlayerIndex = (nextPlayerIndex + 1) % this.players.length;
      } while (updatedPlayers[nextPlayerIndex].bankrupt);
    }

    return new Game(
      this.id,
      this.roomId,
      updatedPlayers,
      this.settings,
      this.board,
      this.phase,
      nextPlayerIndex,
      this.dice,
      [...this.log, {
        timestamp: new Date(),
        message: `${updatedPlayers[playerIndex].username} became a spectator`,
        playerId,
        type: 'system'
      }],
      this.createdAt,
      new Date(),
      this.winner
    );
  }

  private calculatePropertyValue(properties: string[]): number {
    return properties.reduce((total, propertyId) => {
      const property = this.board.properties[propertyId];
      if (!property) return total;
      
      const propertyValue = this.getPropertyPrice(propertyId);
      const houseValue = property.houses * this.getHousePrice(propertyId);
      const mortgageValue = property.isMortgaged ? -Math.floor(propertyValue * 0.5) : 0;
      
      return total + propertyValue + houseValue + mortgageValue;
    }, 0);
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

  // Card drawing methods
  drawChanceCard(playerId: number): CardDrawResult {
    const { CHANCE_CARDS } = require('../../data/gameData');
    
    // Reshuffle if deck is empty
    let chanceDeck = [...this.deckState.chanceDeck];
    if (chanceDeck.length === 0) {
      chanceDeck = [...this.deckState.discardPile.chance];
      chanceDeck = this.shuffleArray(chanceDeck);
    }

    // Draw card
    const cardIndex = chanceDeck.pop()!;
    const card = CHANCE_CARDS[cardIndex];
    
    // Move to discard pile
    const newDiscardPile = {
      ...this.deckState.discardPile,
      chance: [...this.deckState.discardPile.chance, cardIndex]
    };

    const result = this.processCardAction(card, playerId);

    return {
      cardType: 'chance',
      card,
      playerId,
      result
    };
  }

  drawChestCard(playerId: number): CardDrawResult {
    const { CHEST_CARDS } = require('../../data/gameData');
    
    // Reshuffle if deck is empty
    let chestDeck = [...this.deckState.chestDeck];
    if (chestDeck.length === 0) {
      chestDeck = [...this.deckState.discardPile.chest];
      chestDeck = this.shuffleArray(chestDeck);
    }

    // Draw card
    const cardIndex = chestDeck.pop()!;
    const card = CHEST_CARDS[cardIndex];
    
    // Move to discard pile
    const newDiscardPile = {
      ...this.deckState.discardPile,
      chest: [...this.deckState.discardPile.chest, cardIndex]
    };

    const result = this.processCardAction(card, playerId);

    return {
      cardType: 'chest',
      card,
      playerId,
      result
    };
  }

  private processCardAction(card: any, playerId: number): { type: 'money' | 'move' | 'jail' | 'property' | 'none'; amount?: number; newPosition?: number; message: string } {
    const player = this.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    switch (card.action) {
      case 'money':
        return {
          type: 'money',
          amount: card.amount,
          message: `${player.username} ${card.amount > 0 ? 'received' : 'paid'} $${Math.abs(card.amount)}`
        };

      case 'goto':
        return {
          type: 'move',
          newPosition: card.target,
          message: `${player.username} advanced to ${this.getSpaceName(card.target!)}`
        };

      case 'jail':
        return {
          type: 'jail',
          message: `${player.username} went to jail!`
        };

      case 'jailfree':
        return {
          type: 'property',
          message: `${player.username} got a Get Out of Jail Free card`
        };

      case 'nearest_rr':
        const nearestRailroad = this.findNearestRailroad(player.position);
        return {
          type: 'move',
          newPosition: nearestRailroad,
          message: `${player.username} advanced to nearest railroad`
        };

      case 'nearest_util':
        const nearestUtility = this.findNearestUtility(player.position);
        return {
          type: 'move',
          newPosition: nearestUtility,
          message: `${player.username} advanced to nearest utility`
        };

      case 'back':
        const newPosition = Math.max(0, player.position - card.amount!);
        return {
          type: 'move',
          newPosition,
          message: `${player.username} moved back ${card.amount} spaces`
        };

      case 'repairs':
        const repairCost = this.calculateRepairCost(playerId, card.perHouse!, card.perHotel!);
        return {
          type: 'money',
          amount: -repairCost,
          message: `${player.username} paid $${repairCost} for repairs`
        };

      case 'payeach':
        const totalPayment = card.amount! * (this.players.length - 1);
        return {
          type: 'money',
          amount: -totalPayment,
          message: `${player.username} paid $${card.amount} to each player`
        };

      case 'collecteach':
        const totalCollection = card.amount! * (this.players.length - 1);
        return {
          type: 'money',
          amount: totalCollection,
          message: `${player.username} collected $${card.amount} from each player`
        };

      default:
        return {
          type: 'none',
          message: `${player.username} drew a card`
        };
    }
  }

  private shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  private getSpaceName(position: number): string {
    const spaceNames: Record<number, string> = {
      0: 'GO', 5: 'Reading Railroad', 10: 'Jail', 15: 'Pennsylvania Railroad',
      20: 'Free Parking', 25: 'B. & O. Railroad', 30: 'Go to Jail', 35: 'Short Line Railroad'
    };
    return spaceNames[position] || `Space ${position}`;
  }

  private findNearestRailroad(position: number): number {
    const railroads = [5, 15, 25, 35];
    let nearest = railroads[0];
    let minDistance = Infinity;
    
    for (const railroad of railroads) {
      const distance = (railroad - position + 40) % 40;
      if (distance < minDistance) {
        minDistance = distance;
        nearest = railroad;
      }
    }
    
    return nearest;
  }

  private findNearestUtility(position: number): number {
    const utilities = [12, 28]; // Electric Company, Water Works
    let nearest = utilities[0];
    let minDistance = Infinity;
    
    for (const utility of utilities) {
      const distance = (utility - position + 40) % 40;
      if (distance < minDistance) {
        minDistance = distance;
        nearest = utility;
      }
    }
    
    return nearest;
  }

  private calculateRepairCost(playerId: number, perHouse: number, perHotel: number): number {
    const player = this.players.find(p => p.id === playerId);
    if (!player) return 0;

    let houseCount = 0;
    let hotelCount = 0;

    for (const propertyId of player.properties) {
      const property = this.board.properties[propertyId];
      if (property) {
        if (property.houses === 5) {
          hotelCount++;
        } else {
          houseCount += property.houses;
        }
      }
    }

    return (houseCount * perHouse) + (hotelCount * perHotel);
  }
}
