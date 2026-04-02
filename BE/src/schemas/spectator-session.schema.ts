import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class SpectatorSession extends Document {
  @Prop({ required: true })
  gameId: string;

  @Prop({ required: true })
  playerId: number;

  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ required: true, type: Date })
  joinedAt: Date;

  @Prop({ required: true, type: Date })
  lastActive: Date;

  @Prop({ type: Boolean, default: true })
  canChat?: boolean;

  @Prop({ type: Boolean, default: true })
  canViewHistory?: boolean;

  @Prop({ type: Boolean, default: false })
  canViewTransactions?: boolean;

  @Prop({ required: true, default: true })
  isActive: boolean;
}

export const SpectatorSessionSchema = SchemaFactory.createForClass(SpectatorSession);

// Indexes for better query performance
SpectatorSessionSchema.index({ gameId: 1, isActive: 1 });
SpectatorSessionSchema.index({ playerId: 1 });
SpectatorSessionSchema.index({ lastActive: 1 });
