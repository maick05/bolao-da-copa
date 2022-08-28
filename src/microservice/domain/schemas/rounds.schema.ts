/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoundDocument = Round & Document;

@Schema({ timestamps: true, collection: 'rounds', strictQuery: false })
export class Round {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  idCompetition: number;

  @Prop({ required: true })
  idStage: number;

  @Prop({ required: true })
  turn: number;

  @Prop({ required: true })
  edition: number;

  @Prop({ required: false, type: Array })
  RoundsCode: Match[];
}

export class Match {
  @Prop({ required: true })
  idTeamHome: number;

  @Prop({ required: true })
  idTeamOutside: number;

  @Prop({ required: true })
  idGroup: number;

  @Prop({ required: false })
  scoreHome: number;

  @Prop({ required: false })
  scoreOutside: number;

  @Prop({ required: false })
  penaltWinner: number;

  @Prop({ required: false })
  penaltHome: number;

  @Prop({ required: false })
  penaltOutside: number;

  @Prop({ required: false })
  goals: Array<string>;

  @Prop({ required: false, type: Array })
  bets: Bet[];

  @Prop({ required: false, type: Date })
  date: Date;
}

export class Bet {
  @Prop({ required: true })
  idUser: number;

  @Prop({ required: true })
  scoreHome: number;

  @Prop({ required: true })
  scoreOutside: number;

  @Prop({ required: true, type: Date })
  dateTime?: Date;

  @Prop({ required: false })
  scoreBet?: number;
}

const schema = SchemaFactory.createForClass(Round);
schema.index({ name: 1, idCompetition: 1, edition: 1 }, { unique: true });
schema.index({ id: 1, idCompetition: 1, edition: 1 }, { unique: true });

export const RoundsSchema = schema;
