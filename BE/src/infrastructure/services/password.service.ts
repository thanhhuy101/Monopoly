import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IPasswordService } from '../../domain/interfaces/auth.interface';

@Injectable()
export class PasswordService implements IPasswordService {
  private readonly saltRounds = 10;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
