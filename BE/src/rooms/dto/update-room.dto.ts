import { IsString, IsOptional, IsBoolean, IsInt, Min, Max } from 'class-validator';

export class UpdateRoomDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsInt()
  @Min(2)
  @Max(8)
  maxPlayers?: number;

  @IsOptional()
  @IsInt()
  @Min(10)
  @Max(120)
  turnTimeLimit?: number;

  @IsOptional()
  @IsBoolean()
  autoRoll?: boolean;

  @IsOptional()
  @IsInt()
  @Min(500)
  @Max(5000)
  startingMoney?: number;
}
