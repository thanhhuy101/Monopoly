import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GameDocument = Game & Document;

@Schema({ timestamps: true })
export class Game {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  players: number;

  @Prop({ default: 'waiting' })
  status: string;

  @Prop({ type: Object, default: {} })
  gameState: object;
}

export const GameSchema = SchemaFactory.createForClass(Game);
