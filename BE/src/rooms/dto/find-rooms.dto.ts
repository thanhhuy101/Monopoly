import { IsOptional, IsBoolean, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FindRoomsDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by private/public rooms',
    type: 'boolean',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isPrivate?: boolean;

  @ApiPropertyOptional({
    description: 'Search rooms by name',
    type: 'string',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
