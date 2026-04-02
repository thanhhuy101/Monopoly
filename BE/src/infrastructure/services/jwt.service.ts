import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { IJwtService, IJwtPayload, IAuthTokens } from '../../domain/interfaces/auth.interface';

@Injectable()
export class JwtService implements IJwtService {
  constructor(private readonly nestJwtService: NestJwtService) {}

  generateTokens(payload: IJwtPayload): IAuthTokens {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
    };
  }

  generateAccessToken(payload: IJwtPayload): string {
    return this.nestJwtService.sign(payload, {
      expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as any,
    });
  }

  generateRefreshToken(payload: IJwtPayload): string {
    return this.nestJwtService.sign(payload, {
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any,
    });
  }

  verifyToken(token: string): IJwtPayload {
    try {
      return this.nestJwtService.verify(token);
    } catch (error) {
      throw new Error('Token verification failed');
    }
  }
}
