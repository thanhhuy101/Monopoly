import { Controller, Get, Put, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { UsersService } from './services/users.service';
import { UpdateProfileDto } from '../auth/dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@CurrentUser() user: any) {
    return this.usersService.getProfile(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateProfile(@CurrentUser() user: any, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.userId, updateProfileDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get public user info' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User info retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getPublicUserInfo(@Param('id') id: string) {
    return this.usersService.getPublicUserInfo(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get user statistics' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User stats retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserStats(@Param('id') id: string) {
    return this.usersService.getUserStats(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('online-status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update online status' })
  @ApiResponse({ status: 200, description: 'Online status updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateOnlineStatus(@CurrentUser() user: any, @Body() updateData: { isOnline: boolean }) {
    return this.usersService.updateOnlineStatus(user.userId, updateData.isOnline);
  }
}
