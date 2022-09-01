/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BetRules } from './competitions.schema';

export type LeagueDocument = League & Document;

@Schema({ timestamps: true, collection: 'leagues' })
export class League {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  idCompetition: number;

  @Prop({ required: true })
  edition: number;

  @Prop({ required: true })
  idUserAdm: number;

  @Prop({ required: false })
  userIds: number[];

  @Prop({ required: false })
  rules?: BetRules;
}

const schema = SchemaFactory.createForClass(League);
schema.index({ name: 1 }, { unique: true });
schema.index({ id: 1 }, { unique: true });

export const LeaguesSchema = schema;
