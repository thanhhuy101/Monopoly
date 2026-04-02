import { Injectable, NotFoundException, BadRequestException, forwardRef, Inject } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { UpdateProfileDto } from '../../auth/dto/update-profile.dto';
import { UserStatsDto } from '../dto/user-stats.dto';
import { UserStatusGateway } from '../../websocket/user-status.gateway';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(forwardRef(() => UserStatusGateway))
    private readonly userStatusGateway: UserStatusGateway,
  ) {}

  async getProfile(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      emoji: user.emoji,
      avatarUrl: user.avatarUrl,
      level: user.level,
      experience: user.experience,
      coins: user.coins,
      isOnline: user.isOnline,
      lastSeen: user.lastSeen,
    };
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.userRepository.update(userId, updateProfileDto);
    if (!updatedUser) {
      throw new BadRequestException('Failed to update profile');
    }

    return {
      id: updatedUser._id.toString(),
      username: updatedUser.username,
      email: updatedUser.email,
      displayName: updatedUser.displayName,
      emoji: updatedUser.emoji,
      avatarUrl: updatedUser.avatarUrl,
      level: updatedUser.level,
      experience: updatedUser.experience,
      coins: updatedUser.coins,
      isOnline: updatedUser.isOnline,
      lastSeen: updatedUser.lastSeen,
    };
  }

  async getPublicUserInfo(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user._id.toString(),
      username: user.username,
      displayName: user.displayName,
      emoji: user.emoji,
      avatarUrl: user.avatarUrl,
      level: user.level,
      isOnline: user.isOnline,
      lastSeen: user.lastSeen,
    };
  }

  async getUserStats(userId: string): Promise<UserStatsDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // TODO: Implement actual game statistics from game history
    return {
      userId: user._id.toString(),
      username: user.username,
      displayName: user.displayName,
      level: user.level,
      experience: user.experience,
      coins: user.coins,
      totalGames: 0,
      totalWins: 0,
      totalWealth: 0,
      winRate: 0,
      averageGameTime: 0,
    };
  }

  async updateOnlineStatus(userId: string, isOnline: boolean) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.setOnlineStatus(userId, isOnline);
    
    // Emit WebSocket event for real-time updates
    this.userStatusGateway.broadcast('user:status-change', {
      userId,
      isOnline,
      lastSeen: isOnline ? null : new Date(),
    });
    
    return {
      userId: userId,
      isOnline: isOnline,
      lastSeen: isOnline ? null : new Date(),
    };
  }
}
