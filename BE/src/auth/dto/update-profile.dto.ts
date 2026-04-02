import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ example: 'John Doe', description: 'Display name', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  displayName?: string;

  @ApiProperty({ example: '😊', description: 'User emoji', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(2)
  emoji?: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', description: 'Avatar URL', required: false })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
