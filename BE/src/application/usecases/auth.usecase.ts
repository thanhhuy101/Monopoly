import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import type { 
  IAuthService, 
  IRegisterRequest, 
  ILoginRequest, 
  IAuthResponse, 
  IJwtPayload
} from '../../domain/interfaces/auth.interface';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { PasswordService } from '../../infrastructure/services/password.service';
import { JwtService } from '../../infrastructure/services/jwt.service';

@Injectable()
export class AuthUseCase implements IAuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userData: IRegisterRequest): Promise<IAuthResponse> {
    const { username, email, password, displayName, emoji = '😊' } = userData;

    // Check if user already exists
    const existingUserByEmail = await this.userRepository.findByEmail(email);
    if (existingUserByEmail) {
      throw new ConflictException('Email already exists');
    }

    const existingUserByUsername = await this.userRepository.findByUsername(username);
    if (existingUserByUsername) {
      throw new ConflictException('Username already exists');
    }

    // Hash password
    const hashedPassword = await this.passwordService.hash(password);

    // Create user
    const newUser = await this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      displayName,
      emoji,
      level: 1,
      experience: 0,
      coins: 1000,
      isOnline: false,
      lastSeen: new Date(),
    });

    return {
      user: {
        id: newUser._id.toString(),
        username: newUser.username,
        email: newUser.email,
        displayName: newUser.displayName,
        emoji: newUser.emoji,
        avatarUrl: newUser.avatarUrl,
        level: newUser.level,
        experience: newUser.experience,
        coins: newUser.coins,
        isOnline: newUser.isOnline,
      },
    };
  }

  async login(credentials: ILoginRequest): Promise<IAuthResponse> {
    const { email, password } = credentials;

    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await this.passwordService.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const payload: IJwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      username: user.username,
    };

    const tokens = this.jwtService.generateTokens(payload);

    // Set user online
    await this.userRepository.setOnlineStatus(user._id.toString(), true);

    return {
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        emoji: user.emoji,
        avatarUrl: user.avatarUrl,
        level: user.level,
        experience: user.experience,
        coins: user.coins,
        isOnline: true,
      },
      tokens,
    };
  }

  async verifyToken(token: string): Promise<IJwtPayload> {
    try {
      return this.jwtService.verifyToken(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async refreshToken(refreshToken: string): Promise<any> {
    try {
      const payload = this.jwtService.verifyToken(refreshToken);
      
      // Find user to ensure they still exist
      const user = await this.userRepository.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new tokens
      const newPayload: IJwtPayload = {
        sub: user._id.toString(),
        email: user.email,
        username: user.username,
      };

      return this.jwtService.generateTokens(newPayload);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string): Promise<void> {
    await this.userRepository.setOnlineStatus(userId, false);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      // Don't reveal if email exists or not for security
      return;
    }
    
    // TODO: Implement password reset email sending
    // Password reset requested
  }

  async updateProfile(userId: string, updateData: any): Promise<any> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const updatedUser = await this.userRepository.update(userId, updateData);
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
    };
  }
}
