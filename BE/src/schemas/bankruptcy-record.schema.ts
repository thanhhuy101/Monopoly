import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class BankruptcyRecord extends Document {
  @Prop({ required: true })
  gameId: string;

  @Prop({ required: true })
  playerId: number;

  @Prop({ required: true, type: Date })
  triggeredAt: Date;

  @Prop({ required: true, type: Number })
  debtAmount: number;

  @Prop({ type: [String] })
  properties?: string[];

  @Prop({ type: Number })
  cash?: number;

  @Prop({ type: Number })
  totalValue?: number;

  @Prop({ type: String, enum: ['liquidated', 'traded', 'eliminated'] })
  resolutionType?: string;

  @Prop({ type: Number })
  recoveredAmount?: number;

  @Prop({ type: Date })
  eliminatedAt?: Date;

  @Prop({ type: Number })
  finalRank?: number;
}

export const BankruptcyRecordSchema = SchemaFactory.createForClass(BankruptcyRecord);

// Indexes for better query performance
BankruptcyRecordSchema.index({ gameId: 1, playerId: 1 });
BankruptcyRecordSchema.index({ triggeredAt: -1 });
BankruptcyRecordSchema.index({ resolutionType: 1 });
