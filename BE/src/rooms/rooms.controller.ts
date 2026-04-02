import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { RoomsService } from './services/rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';
import { RoomResponseDto } from './dto/room-response.dto';
import { FindRoomsDto } from './dto/find-rooms.dto';
import { PaginationResponseDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { NoCacheInterceptor } from '../common/interceptors/no-cache.interceptor';

@ApiTags('rooms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new game room' })
  @ApiResponse({
    status: 201,
    description: 'Room created successfully',
    type: RoomResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createRoomDto: CreateRoomDto, @CurrentUser() user: any) {
    return this.roomsService.createWithDetails(createRoomDto, user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get list of available rooms' })
  @ApiResponse({
    status: 200,
    description: 'List of rooms',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/RoomResponseDto' },
        },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
        total: { type: 'number', example: 25 },
        totalPages: { type: 'number', example: 3 },
        hasNext: { type: 'boolean', example: true },
        hasPrev: { type: 'boolean', example: false },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiQuery({
    name: 'isPrivate',
    required: false,
    type: 'boolean',
    description: 'Filter by private/public rooms',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: 'string',
    description: 'Search rooms by name',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: 'number',
    description: 'Page number (starts from 1)',
    minimum: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
    description: 'Number of items per page',
    minimum: 1,
    maximum: 100,
  })
  @UseInterceptors(NoCacheInterceptor)
  async findAll(
    @Query() findRoomsDto: FindRoomsDto,
  ): Promise<PaginationResponseDto<RoomResponseDto>> {
    return this.roomsService.findAll(findRoomsDto.isPrivate, findRoomsDto.search, findRoomsDto);
  }

  @Get('my-rooms')
  @ApiOperation({ summary: 'Get rooms created by or joined by current user' })
  @ApiResponse({
    status: 200,
    description: 'User rooms',
    type: [RoomResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findMyRooms(@CurrentUser() user: any) {
    return this.roomsService.findRoomsByUser(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get room details by ID' })
  @ApiResponse({
    status: 200,
    description: 'Room details',
    type: RoomResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Room not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update room settings' })
  @ApiResponse({
    status: 200,
    description: 'Room updated successfully',
    type: RoomResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Room not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only creator can update room',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
    @CurrentUser() user: any,
  ) {
    return this.roomsService.update(id, updateRoomDto, user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a room' })
  @ApiResponse({ status: 204, description: 'Room deleted successfully' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only creator can delete room',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.roomsService.remove(id, user.userId);
  }

  @Post(':id/join')
  @ApiOperation({ summary: 'Join a room' })
  @ApiResponse({
    status: 200,
    description: 'Joined room successfully',
    type: RoomResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Room not found' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Room full, wrong password, etc.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async joinRoom(
    @Param('id') id: string,
    @Body() joinRoomDto: JoinRoomDto,
    @CurrentUser() user: any,
  ) {
    return this.roomsService.joinRoom(id, joinRoomDto, user.userId);
  }

  @Post(':id/leave')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Leave a room' })
  @ApiResponse({ status: 200, description: 'Left room successfully' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  @ApiResponse({ status: 400, description: 'Bad Request - User not in room' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async leaveRoom(@Param('id') id: string, @CurrentUser() user: any) {
    const result = await this.roomsService.leaveRoom(id, user.userId);
    // If room was deleted due to no players, return 204
    if (result === null) {
      return;
    }
    return result;
  }
}
