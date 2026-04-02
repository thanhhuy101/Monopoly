import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class TransactionHistory extends Document {
  @Prop({ required: true, ref: 'Game' })
  gameId: string;

  @Prop({ required: true })
  playerId: number;

  @Prop({
    required: true,
    enum: ['buy', 'sell', 'trade', 'mortgage', 'bankruptcy', 'liquidation', 'elimination'],
  })
  type: 'buy' | 'sell' | 'trade' | 'mortgage' | 'bankruptcy' | 'liquidation' | 'elimination';

  @Prop({ required: true, type: Number })
  amount: number;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ type: [Number] })
  relatedPlayers?: number[];

  @Prop({ type: [String] })
  relatedProperties?: string[];

  @Prop({
    type: {
      tradeId: { type: String },
      bankruptcyId: { type: String },
      liquidationId: { type: String },
    },
  })
  metadata?: {
    tradeId?: string;
    bankruptcyId?: string;
    liquidationId?: string;
  };

  @Prop({ required: true, type: Date })
  timestamp: Date;
}

export const TransactionHistorySchema = SchemaFactory.createForClass(TransactionHistory);

// Indexes for better query performance
TransactionHistorySchema.index({ gameId: 1, playerId: 1 });
TransactionHistorySchema.index({ gameId: 1, type: 1 });
TransactionHistorySchema.index({ timestamp: -1 });
TransactionHistorySchema.index({ playerId: 1, timestamp: -1 });
