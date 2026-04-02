import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GameRoom, RoomDocument } from '../../schemas/room.schema';
import { CreateRoomDto } from '../dto/create-room.dto';
import { UpdateRoomDto } from '../dto/update-room.dto';
import { JoinRoomDto } from '../dto/join-room.dto';
import { RoomResponseDto } from '../dto/room-response.dto';
import { PaginationDto, PaginationResponseDto } from '../../common/dto/pagination.dto';
import * as bcrypt from 'bcrypt';
import { forwardRef, Inject } from '@nestjs/common';
import { RoomEventsGateway } from '../../websocket/room-events.gateway';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(GameRoom.name) private roomModel: Model<RoomDocument>,
    @Inject(forwardRef(() => RoomEventsGateway))
    private readonly roomEventsGateway: RoomEventsGateway,
  ) {}

  async create(createRoomDto: CreateRoomDto, creatorId: string): Promise<RoomResponseDto> {
    const roomData = {
      name: createRoomDto.name,
      creatorId: new Types.ObjectId(creatorId),
      isPrivate: createRoomDto.isPrivate || false,
      password: createRoomDto.password,
      maxPlayers: createRoomDto.maxPlayers || 4,
      currentPlayers: 1,
      status: 'waiting' as const,
      players: [new Types.ObjectId(creatorId)],
      settings: {
        turnTimeLimit: createRoomDto.turnTimeLimit || 30,
        autoRoll: createRoomDto.autoRoll || false,
        startingMoney: createRoomDto.startingMoney || 1500,
      },
    };

    // Hash password if room is private
    if (roomData.isPrivate && roomData.password) {
      roomData.password = await bcrypt.hash(roomData.password, 10);
    }

    const room = new this.roomModel(roomData);
    const savedRoom = await room.save();

    return this.mapToResponseDto(savedRoom);
  }

  async createWithDetails(createRoomDto: CreateRoomDto, creatorId: string): Promise<RoomResponseDto> {
    // First create the room
    const room = await this.create(createRoomDto, creatorId);
    
    // Then fetch it with populated data
    return this.findOne(room._id);
  }

  async findAll(isPrivate?: boolean, search?: string, pagination?: PaginationDto): Promise<PaginationResponseDto<RoomResponseDto>> {
    const filter: any = {};
    
    // Filter by isPrivate if provided
    if (isPrivate !== undefined && isPrivate !== null) {
      filter.isPrivate = isPrivate;
    }
    
    // By default, only show waiting rooms
    filter.status = 'waiting';

    // Add search filter if provided
    if (search && search.trim()) {
      filter.name = { $regex: search.trim(), $options: 'i' }; // Case-insensitive search
    }

    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    // Get total count
    const total = await this.roomModel.countDocuments(filter);

    // Get paginated results
    const rooms = await this.roomModel
      .find(filter)
      .populate('creatorId', 'username displayName emoji')
      .populate('players', 'username displayName emoji')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const data = rooms.map(room => this.mapToResponseDto(room));
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async findOne(id: string): Promise<RoomResponseDto> {
    const room = await this.roomModel
      .findById(id)
      .populate('creatorId', 'username displayName emoji')
      .populate('players', 'username displayName emoji')
      .exec();

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return this.mapToResponseDto(room);
  }

  async update(id: string, updateRoomDto: UpdateRoomDto, userId: string): Promise<RoomResponseDto> {
    const room = await this.roomModel.findById(id);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Check if user is the creator
    if (room.creatorId.toString() !== userId) {
      throw new ForbiddenException('Only the room creator can update the room');
    }

    // Hash password if updating password
    if (updateRoomDto.password) {
      updateRoomDto.password = await bcrypt.hash(updateRoomDto.password, 10);
    }

    // Don't allow changing max players below current players
    if (updateRoomDto.maxPlayers && updateRoomDto.maxPlayers < room.currentPlayers) {
      throw new BadRequestException('Cannot set max players below current player count');
    }

    const updatedRoom = await this.roomModel
      .findByIdAndUpdate(id, updateRoomDto, { new: true })
      .populate('creatorId', 'username displayName emoji')
      .populate('players', 'username displayName emoji')
      .exec();

    return this.mapToResponseDto(updatedRoom);
  }

  async remove(id: string, userId: string): Promise<void> {
    const room = await this.roomModel.findById(id);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Check if user is the creator
    if (room.creatorId.toString() !== userId) {
      throw new ForbiddenException('Only the room creator can delete the room');
    }

    await this.roomModel.findByIdAndDelete(id);
  }

  async joinRoom(id: string, joinRoomDto: JoinRoomDto, userId: string): Promise<RoomResponseDto> {
    const room = await this.roomModel.findById(id);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Check if room is full
    if (room.currentPlayers >= room.maxPlayers) {
      throw new BadRequestException('Room is full');
    }

    // Check if room is not in waiting status
    if (room.status !== 'waiting') {
      throw new BadRequestException('Cannot join a room that is already playing or finished');
    }

    // Check if user is already in the room
    if (room.players.some(playerId => playerId.toString() === userId)) {
      throw new BadRequestException('User is already in the room');
    }

    // Check password for private rooms
    if (room.isPrivate && room.password) {
      if (!joinRoomDto.password) {
        throw new BadRequestException('Password required for private room');
      }
      const isPasswordValid = await bcrypt.compare(joinRoomDto.password, room.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid password');
      }
    }

    // Add user to room
    const updatedRoom = await this.roomModel
      .findByIdAndUpdate(
        id,
        {
          $push: { players: new Types.ObjectId(userId) },
          $inc: { currentPlayers: 1 },
        },
        { new: true }
      )
      .populate('creatorId', 'username displayName emoji')
      .populate('players', 'username displayName emoji')
      .exec();

    const response = this.mapToResponseDto(updatedRoom);

    // Emit WebSocket event to all clients in the room
    this.roomEventsGateway.broadcastRoomUpdate(id, 'room:player-joined', {
      room: response,
      playerId: userId,
    });

    return response;
  }

  async leaveRoom(id: string, userId: string): Promise<RoomResponseDto | null> {
    const room = await this.roomModel.findById(id);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Check if user is in the room
    const playerIndex = room.players.findIndex(playerId => playerId.toString() === userId);
    if (playerIndex === -1) {
      throw new BadRequestException('User is not in the room');
    }

    // Get the leaving player's info before removing them
    const roomWithPlayerInfo = await this.roomModel
      .findById(id)
      .populate('creatorId', 'username displayName emoji')
      .populate('players', 'username displayName emoji')
      .exec();
    
    const leavingPlayer = roomWithPlayerInfo?.players.find((player: any) => player._id.toString() === userId);

    // Extract player info safely
    const leavingPlayerInfo = leavingPlayer ? {
      _id: (leavingPlayer as any)._id,
      username: (leavingPlayer as any).username,
      displayName: (leavingPlayer as any).displayName,
      emoji: (leavingPlayer as any).emoji,
    } : null;

    // Remove user from room
    const updatedRoom = await this.roomModel
      .findByIdAndUpdate(
        id,
        {
          $pull: { players: new Types.ObjectId(userId) },
          $inc: { currentPlayers: -1 },
        },
        { new: true }
      )
      .populate('creatorId', 'username displayName emoji')
      .populate('players', 'username displayName emoji')
      .exec();

    if (!updatedRoom) {
      throw new NotFoundException('Room not found after update');
    }

    // If creator left and there are still players, transfer ownership to the first player
    if (room.creatorId.toString() === userId && updatedRoom.currentPlayers > 0) {
      const newCreatorId = updatedRoom.players[0];
      await this.roomModel.findByIdAndUpdate(id, {
        creatorId: newCreatorId,
      });
      
      // Fetch the room again to get updated creator information
      const roomWithNewCreator = await this.roomModel
        .findById(id)
        .populate('creatorId', 'username displayName emoji')
        .populate('players', 'username displayName emoji')
        .exec();
      
      if (roomWithNewCreator) {
        const response = this.mapToResponseDto(roomWithNewCreator);
        
        // Emit WebSocket event to all clients in the room with updated creator and leaving player info
        this.roomEventsGateway.broadcastRoomUpdate(id, 'room:player-left', {
          room: response,
          playerId: userId,
          newHostId: newCreatorId.toString(),
          leavingPlayer: leavingPlayerInfo,
        });
        
        return response;
      }
    }

    // If no players left, delete the room
    if (updatedRoom.currentPlayers === 0) {
      await this.roomModel.findByIdAndDelete(id);
      
      // Emit room deleted event
      this.roomEventsGateway.broadcastRoomUpdate(id, 'room:deleted', {
        roomId: id,
        playerId: userId,
      });
      
      return null;
    }

    const response = this.mapToResponseDto(updatedRoom);

    // Emit WebSocket event to all clients in the room with leaving player info
    this.roomEventsGateway.broadcastRoomUpdate(id, 'room:player-left', {
      room: response,
      playerId: userId,
      leavingPlayer: leavingPlayerInfo,
    });

    return response;
  }

  async findRoomsByUser(userId: string): Promise<RoomResponseDto[]> {
    const rooms = await this.roomModel
      .find({
        $or: [
          { creatorId: new Types.ObjectId(userId) },
          { players: new Types.ObjectId(userId) },
        ],
      })
      .populate('creatorId', 'username displayName emoji')
      .populate('players', 'username displayName emoji')
      .sort({ createdAt: -1 })
      .exec();

    return rooms.map(room => this.mapToResponseDto(room));
  }

  private mapToResponseDto(room: any): RoomResponseDto {
    return {
      _id: room._id.toString(),
      name: room.name,
      creatorId: room.creatorId._id ? room.creatorId._id.toString() : room.creatorId.toString(),
      isPrivate: room.isPrivate,
      maxPlayers: room.maxPlayers,
      currentPlayers: room.currentPlayers,
      status: room.status,
      players: room.players.map((player: any) => 
        player._id ? player._id.toString() : player.toString()
      ),
      // Include populated player info when available
      ...(room.creatorId && room.creatorId.username && {
        creatorInfo: {
          _id: room.creatorId._id || room.creatorId.toString(),
          username: room.creatorId.username,
          displayName: room.creatorId.displayName,
          emoji: room.creatorId.emoji,
        }
      }),
      ...(room.players && room.players.length > 0 && room.players[0].username && {
        playerInfo: room.players.map((player: any) => ({
          _id: player._id || player.toString(),
          username: player.username,
          displayName: player.displayName,
          emoji: player.emoji,
        }))
      }),
      settings: room.settings,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
    };
  }
}
