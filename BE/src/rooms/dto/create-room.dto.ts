import { IsString, IsOptional, IsBoolean, IsInt, Min, Max } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean = false;

  @IsOptional()
  @IsString()
  password?: string;

  // Game settings with defaults
  @IsOptional()
  @IsInt()
  @Min(2)
  @Max(8)
  maxPlayers?: number = 4;

  @IsOptional()
  @IsInt()
  @Min(10)
  @Max(120)
  turnTimeLimit?: number = 30;

  @IsOptional()
  @IsBoolean()
  autoRoll?: boolean = false;

  @IsOptional()
  @IsInt()
  @Min(500)
  @Max(5000)
  startingMoney?: number = 1500;
}
