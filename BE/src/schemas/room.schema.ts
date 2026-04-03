import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RoomDocument = GameRoom & Document;

@Schema({ timestamps: true })
export class GameRoom {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  creatorId: Types.ObjectId;

  @Prop({ required: true, default: false })
  isPrivate: boolean;

  @Prop()
  password?: string;

  @Prop({ required: true, default: 4 })
  maxPlayers: number;

  @Prop({ required: true, default: 0 })
  currentPlayers: number;

  @Prop({ 
    required: true, 
    enum: ['waiting', 'playing', 'finished'], 
    default: 'waiting' 
  })
  status: 'waiting' | 'playing' | 'finished';

  @Prop({ type: [Types.ObjectId], default: [], ref: 'User' })
  players: Types.ObjectId[];

  @Prop({
    type: {
      turnTimeLimit: { type: Number, default: 30 },
      autoRoll: { type: Boolean, default: false },
      startingMoney: { type: Number, default: 1200 }
    },
    default: {
      turnTimeLimit: 30,
      autoRoll: false,
      startingMoney: 1200
    }
  })
  settings: {
    turnTimeLimit: number;
    autoRoll: boolean;
    startingMoney: number;
  };
}

export const RoomSchema = SchemaFactory.createForClass(GameRoom);

// Indexes for better performance
RoomSchema.index({ creatorId: 1 });
RoomSchema.index({ status: 1 });
RoomSchema.index({ isPrivate: 1 });
RoomSchema.index({ createdAt: -1 });
