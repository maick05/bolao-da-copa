import { Module } from '@nestjs/common';
import { BetsController } from '../controller/bets.controller';
import { PushBetService } from '../../domain/service/bets/push-bet.service';
import { CalculateBetsScoreService } from '../../domain/service/bets/calculate-bets-score.service';
import { GetBetsClassificationService } from '../../domain/service/bets/get-bets-classification.service';
import { UsersModule } from './users.module';
import { CompetitionsModule } from './competitions.module';
import { RoundsModule } from './rounds.module';

@Module({
  imports: [RoundsModule, CompetitionsModule, UsersModule],
  controllers: [BetsController],
  providers: [
    PushBetService,
    CalculateBetsScoreService,
    GetBetsClassificationService
  ]
})
export class BetsModule {}
