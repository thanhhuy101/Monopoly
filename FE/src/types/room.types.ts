export interface GameRoom {
  _id: string;
  name: string;
  creatorId: string;
  isPrivate: boolean;
  maxPlayers: number;
  currentPlayers: number;
  status: 'waiting' | 'playing' | 'finished';
  players: string[];
  settings: {
    turnTimeLimit: number;
    autoRoll: boolean;
    startingMoney: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserInfo {
  _id: string;
  username: string;
  displayName: string;
  emoji: string;
}

export interface CreateRoomDto {
  name: string;
  isPrivate?: boolean;
  password?: string;
  maxPlayers?: number;
  turnTimeLimit?: number;
  autoRoll?: boolean;
  startingMoney?: number;
}

export interface UpdateRoomDto {
  name?: string;
  isPrivate?: boolean;
  password?: string;
  maxPlayers?: number;
  turnTimeLimit?: number;
  autoRoll?: boolean;
  startingMoney?: number;
}

export interface JoinRoomDto {
  password?: string;
}

export interface RoomResponse extends GameRoom {}

export interface RoomDetailsResponse extends RoomResponse {
  creatorInfo?: UserInfo;
  playerInfo?: UserInfo[];
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  statusCode: number;
  error?: string;
}
