export class RoomResponseDto {
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
  createdAt: Date;
  updatedAt: Date;
}
