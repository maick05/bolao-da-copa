/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CompetitionDocument = Competition & Document;

export class BetRules {
  @Prop({ required: true })
  exactlyMatch: number;

  @Prop({ required: true })
  oneScore: number;

  @Prop({ required: true })
  winner: number;

  @Prop({ required: true })
  penaltWinner: number;
}

@Schema({ timestamps: true, collection: 'competitions', strictQuery: false })
export class Competition {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  localeType: string;

  @Prop({ required: false, type: Array })
  editions: number[];

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  teamType: 'Country' | 'Club';

  @Prop({ required: true, type: Array })
  stages: Stage[];

  @Prop({ required: false, type: Object })
  rules: BetRules;
}

export class Stage {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  sequenceNivel: number;

  @Prop({ required: true })
  turns: number;
}

const schema = SchemaFactory.createForClass(Competition);
schema.index({ name: 1 }, { unique: true });
schema.index({ id: 1 }, { unique: true });

export const CompetitionsSchema = schema;
