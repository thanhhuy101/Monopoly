import { ApiProperty } from '@nestjs/swagger';

export class UserStatsDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'User ID' })
  userId: string;

  @ApiProperty({ example: 'johndoe', description: 'Username' })
  username: string;

  @ApiProperty({ example: 'John Doe', description: 'Display name' })
  displayName: string;

  @ApiProperty({ example: 5, description: 'User level' })
  level: number;

  @ApiProperty({ example: 2500, description: 'User experience points' })
  experience: number;

  @ApiProperty({ example: 1500, description: 'User coins' })
  coins: number;

  @ApiProperty({ example: 25, description: 'Total games played' })
  totalGames: number;

  @ApiProperty({ example: 15, description: 'Total games won' })
  totalWins: number;

  @ApiProperty({ example: 5000, description: 'Total wealth accumulated' })
  totalWealth: number;

  @ApiProperty({ example: 0.6, description: 'Win rate (0-1)' })
  winRate: number;

  @ApiProperty({ example: 1800, description: 'Average game time in seconds' })
  averageGameTime: number;

  @ApiProperty({ example: 'Boardwalk', description: 'Favorite property', required: false })
  favoriteProperty?: string;
}
