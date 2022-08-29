import { Module } from '@nestjs/common';
import { RoundsMongoose } from '../repository/rounds.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Round, RoundsSchema } from '../../domain/schemas/rounds.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Round.name, schema: RoundsSchema }])
  ],
  controllers: [],
  providers: [RoundsMongoose],
  exports: [RoundsMongoose]
})
export class RoundsModule {}
