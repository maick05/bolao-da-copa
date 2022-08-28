import { Module } from '@nestjs/common';
import { BetsController } from '../controller/bets.controller';
import { PushBetService } from '../../domain/service/push-bet.service';
import { RoundsMongoose } from '../repository/rounds.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Round, RoundsSchema } from '../../domain/schemas/rounds.schema';
import { CalculateBetsScoreService } from '../../domain/service/calculate-bets-score.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Round.name, schema: RoundsSchema }])
  ],
  controllers: [BetsController],
  providers: [PushBetService, CalculateBetsScoreService, RoundsMongoose]
})
export class BetsModule {}
