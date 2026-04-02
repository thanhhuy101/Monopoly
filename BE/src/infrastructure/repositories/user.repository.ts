import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { IUserRepository } from '../../domain/interfaces/auth.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async create(userData: any): Promise<UserDocument> {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  async update(id: string, updates: any): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(id, updates, { new: true }).exec();
  }

  async setOnlineStatus(id: string, isOnline: boolean): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { 
      isOnline, 
      lastSeen: new Date() 
    }).exec();
  }
}
