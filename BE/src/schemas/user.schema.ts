import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  collection: 'users',
})
export class User {
  @Prop({ required: true, unique: true, trim: true })
  username: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true })
  displayName: string;

  @Prop({ required: true, default: '😊' })
  emoji: string;

  @Prop({ trim: true })
  avatarUrl?: string;

  @Prop({ required: true, default: 1 })
  level: number;

  @Prop({ required: true, default: 0 })
  experience: number;

  @Prop({ required: true, default: 1000 })
  coins: number;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true, default: false })
  isOnline: boolean;

  @Prop({ required: true, default: () => new Date() })
  lastSeen: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes for performance
UserSchema.index({ isOnline: 1 });
UserSchema.index({ level: -1 });
UserSchema.index({ experience: -1 });

// Virtual for user ID
UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
UserSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret: any) {
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});
