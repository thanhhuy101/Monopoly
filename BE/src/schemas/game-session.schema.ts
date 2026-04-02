import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class GameSession extends Document {
  @Prop({ required: true, ref: 'GameRoom' })
  roomId: string;

  @Prop({ required: true, type: [Number] })
  players: number[];

  @Prop({
    required: true,
    enum: ['active', 'finished', 'abandoned'],
    default: 'active',
  })
  status: 'active' | 'finished' | 'abandoned';

  @Prop({ type: Number })
  winner?: number;

  @Prop({
    type: [{
      playerId: { type: Number, required: true },
      rank: { type: Number, required: true },
      finalAssets: { type: Number, required: true },
      eliminatedAt: { type: Date },
      playTime: { type: Number, required: true },
    }],
  })
  finalStandings?: {
    playerId: number;
    rank: number;
    finalAssets: number;
    eliminatedAt?: Date;
    playTime: number;
  }[];

  @Prop({
    type: {
      totalTurns: { type: Number, required: true },
      duration: { type: Number, required: true },
      totalTransactions: { type: Number, required: true },
      bankruptcies: { type: Number, required: true },
    },
    required: true,
  })
  gameStats: {
    totalTurns: number;
    duration: number;
    totalTransactions: number;
    bankruptcies: number;
  };

  @Prop({ required: true, type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  finishedAt?: Date;
}

export const GameSessionSchema = SchemaFactory.createForClass(GameSession);

// Indexes for better query performance
GameSessionSchema.index({ roomId: 1 });
GameSessionSchema.index({ status: 1 });
GameSessionSchema.index({ winner: 1 });
GameSessionSchema.index({ createdAt: -1 });
GameSessionSchema.index({ 'finalStandings.playerId': 1 });
