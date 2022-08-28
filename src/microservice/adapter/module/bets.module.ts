import { Module } from '@nestjs/common';
import { BetsController } from '../controller/bets.controller';
import { PushBetService } from '../../domain/service/push-bet.service';
import { RoundsMongoose } from '../repository/rounds.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Round, RoundsSchema } from '../../domain/schemas/rounds.schema';
import { CalculateBetsScoreService } from '../../domain/service/calculate-bets-score.service';
import { CompetitionsMongoose } from '../repository/competitions.repository';
import {
  Competition,
  CompetitionsSchema
} from '../../domain/schemas/competitions.schema';
import { GetBetsClassificationService } from '../../domain/service/get-bets-classification.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Round.name, schema: RoundsSchema }]),
    MongooseModule.forFeature([
      { name: Competition.name, schema: CompetitionsSchema }
    ])
  ],
  controllers: [BetsController],
  providers: [
    PushBetService,
    CalculateBetsScoreService,
    RoundsMongoose,
    CompetitionsMongoose,
    GetBetsClassificationService
  ]
})
export class BetsModule {}
