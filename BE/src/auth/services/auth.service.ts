import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthUseCase } from '../../application/usecases/auth.usecase';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { IAuthResponse, IJwtPayload } from '../../domain/interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(private authUseCase: AuthUseCase) {}

  async register(registerDto: RegisterDto): Promise<IAuthResponse> {
    return this.authUseCase.register(registerDto);
  }

  async login(loginDto: LoginDto): Promise<IAuthResponse> {
    return this.authUseCase.login(loginDto);
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<any> {
    return this.authUseCase.refreshToken(refreshTokenDto.refreshToken);
  }

  async verifyToken(token: string): Promise<IJwtPayload> {
    return this.authUseCase.verifyToken(token);
  }

  async logout(userId: string): Promise<void> {
    return this.authUseCase.logout(userId);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    return this.authUseCase.forgotPassword(forgotPasswordDto.email);
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<any> {
    return this.authUseCase.updateProfile(userId, updateProfileDto);
  }

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const result = await this.authUseCase.login({ email, password });
      return result.user;
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
