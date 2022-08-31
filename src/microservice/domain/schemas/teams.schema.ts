/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TeamDocument = Team & Document;

@Schema({ timestamps: true, collection: 'teams' })
export class Team {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  teamType: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: false })
  idCountry: number;

  @Prop({ required: false })
  image: string;
}

const schema = SchemaFactory.createForClass(Team);
schema.index({ name: 1 }, { unique: true });
schema.index({ id: 1 }, { unique: true });

export const TeamsSchema = schema;
