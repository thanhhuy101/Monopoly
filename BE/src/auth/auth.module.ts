import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { AuthUseCase } from '../application/usecases/auth.usecase';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { PasswordService } from '../infrastructure/services/password.service';
import { JwtService } from '../infrastructure/services/jwt.service';
import { User, UserSchema } from '../schemas/user.schema';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'default-secret',
        signOptions: {
          expiresIn: '15m',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthUseCase,
    UserRepository,
    PasswordService,
    JwtService,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [AuthService, AuthUseCase, UserRepository, PasswordService, JwtService],
})
export class AuthModule {}
