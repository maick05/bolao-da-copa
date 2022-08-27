import { Module } from '@nestjs/common';
import { BetsController } from '../controller/bets.controller';
import { BetsService } from '../../domain/service/bets.service';
import { RoundsMongoose } from '../repository/rounds.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Round, RoundsSchema } from '../../domain/schemas/rounds.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Round.name, schema: RoundsSchema }])
  ],
  controllers: [BetsController],
  providers: [BetsService, RoundsMongoose]
})
export class BetsModule {}
