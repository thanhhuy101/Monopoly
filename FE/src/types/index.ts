// Global type definitions for the Monopoly game application
// These types match the API response formats from BE/api.md

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  emoji: string;
  avatarUrl?: string;
  level: number;
  experience: number;
  coins: number;
  isOnline: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  displayName: string;
  emoji: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface IJwtPayload {
  sub: string;            // User ID
  email: string;
  username: string;
  iat?: number;          // Issued at timestamp
  exp?: number;          // Expiration timestamp
  [key: string]: any;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}

// User-related types
export interface PublicUser {
  uid: string;
  username: string;
  displayName: string;
  emoji: string;
  avatarUrl?: string;
  isOnline?: boolean;
}

export interface UserStats {
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
  totalEarnings: number;
  averageGameTime: number;
  propertiesOwned: number;
  bankruptcies: number;
}

export interface FullUser extends PublicUser {
  email: string;
  isOnline: boolean;
  lastSeen: string;
}

// Room-related types
export interface Room {
  id: string;
  name: string;
  isPrivate: boolean;
  maxPlayers: number;
  currentPlayers: number;
  status: 'waiting' | 'playing' | 'finished';
  turnTimeLimit: number;
  autoRoll: boolean;
  startingMoney: number;
  creator: PublicUser;
  players?: RoomPlayer[];
  createdAt: string;
  updatedAt?: string;
}

export interface RoomPlayer {
  uid: string;
  username: string;
  displayName: string;
  emoji: string;
  isReady: boolean;
  isOnline?: boolean;
  joinedAt: string;
}

export interface CreateRoomRequest {
  name: string;
  isPrivate?: boolean;
  password?: string;
  maxPlayers: number;
  turnTimeLimit: number;
  autoRoll: boolean;
  startingMoney: number;
}

export interface UpdateRoomRequest {
  name?: string;
  isPrivate?: boolean;
  password?: string;
  maxPlayers?: number;
  turnTimeLimit?: number;
  autoRoll?: boolean;
  startingMoney?: number;
}

export interface JoinRoomRequest {
  password?: string;
}

// Game-related types
export interface GameState {
  id: string;
  roomId: string;
  status: 'waiting' | 'playing' | 'finished';
  currentPlayer: string;
  turn: number;
  players: GamePlayer[];
  board: GameBoard;
  dice: DiceRoll;
  lastAction: string;
  createdAt: string;
  updatedAt: string;
}

export interface GamePlayer {
  uid: string;
  username: string;
  position: number;
  money: number;
  properties: string[];
  jailStatus: boolean;
  bankrupt: boolean;
}

export interface GameBoard {
  properties: GameProperty[];
}

export interface GameProperty {
  id: string;
  name: string;
  position: number;
  price: number;
  rent: number;
  owner?: string;
  houses: number;
  hotel: boolean;
  mortgaged: boolean;
}

export interface DiceRoll {
  dice1: number;
  dice2: number;
  doubles: boolean;
}

export interface BuyPropertyRequest {
  propertyId: string;
}

export interface BuildHouseRequest {
  propertyId: string;
  houses: number;
}

export interface TradeRequest {
  targetPlayerId: string;
  offeredMoney?: number;
  offeredPropertyId?: string;
  requestedMoney?: number;
  requestedPropertyId?: string;
}

export interface MortgageRequest {
  propertyId: string;
  isMortgaging: boolean;
}

// Shop-related types
export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isActive: boolean;
  uses: number;
}

export interface Purchase {
  id: string;
  itemId: string;
  userId: string;
  price: number;
  remainingUses: number;
  purchasedAt: string;
  lastUsedAt?: string;
  item?: ShopItem;
}

export interface PurchaseItemRequest {
  itemId: string;
}

export interface UseItemRequest {
  purchaseId: string;
}

export interface CreateShopItemRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  uses: number;
  isActive: boolean;
}

export interface UpdateShopItemRequest {
  name?: string;
  price?: number;
  isActive?: boolean;
}

export interface ShopStats {
  totalRevenue: number;
  totalPurchases: number;
  mostPopularItem: {
    id: string;
    name: string;
    purchaseCount: number;
  };
  dailyRevenue: Array<{
    date: string;
    revenue: number;
  }>;
}

// Leaderboard types
export interface LeaderboardEntry {
  rank: number;
  user: PublicUser;
  stats?: UserStats;
  points?: number;
  categoryValue?: number;
  gamesPlayed?: number;
  wins?: number;
  totalWealth?: number;
  averageGameEarnings?: number;
  winRate?: number;
}

export interface UserRank {
  position: number;
  totalPlayers: number;
  points: number;
  percentile: number;
}

export interface LeaderboardUserStats {
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
  totalEarnings: number;
  averageScore: number;
  currentStreak: number;
  bestStreak: number;
  rankHistory: Array<{
    date: string;
    rank: number;
    points: number;
  }>;
}

export interface UpdateLeaderboardRequest {
  gameResult: {
    won: boolean;
    finalMoney: number;
    propertiesOwned: number;
    gameDuration: number;
    opponentsDefeated: number;
  };
}

// API Response wrapper types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  statusCode?: number;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Error types
export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}

// Utility types
export type RoomStatus = 'waiting' | 'playing' | 'finished';
export type GameStatus = 'waiting' | 'playing' | 'finished';
export type ShopCategory = 'dice' | 'powerup' | 'token' | 'avatar' | 'other';
export type LeaderboardCategory = 'wins' | 'wealth' | 'winRate';

// Environment configuration
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
}

// Component props types
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: string;
}
