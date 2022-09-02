import { Module } from '@nestjs/common';
import { BetsController } from '../controller/bets.controller';
import { PushBetService } from '../../domain/service/bets/push-bet.service';
import { CalculateBetsScoreService } from '../../domain/service/bets/calculate-bets-score.service';
import { GetBetsClassificationService } from '../../domain/service/bets/get-bets-classification.service';
import { UsersModule } from './users.module';
import { CompetitionsModule } from './competitions.module';
import { RoundsModule } from './rounds.module';
import { BetsMongoose } from '../repository/rounds/bets.repository';
import { MatchesMongoose } from '../repository/rounds/matches.repository';
import { GetBetsMatchService } from '../../domain/service/bets/get-bets-match.service';
import { LeaguesModule } from './league.module';
import { AuthJwtModule } from './auth-jwt.module';

@Module({
  imports: [
    RoundsModule,
    CompetitionsModule,
    UsersModule,
    LeaguesModule,
    AuthJwtModule
  ],
  controllers: [BetsController],
  providers: [
    PushBetService,
    CalculateBetsScoreService,
    GetBetsClassificationService,
    BetsMongoose,
    MatchesMongoose,
    GetBetsMatchService
  ]
})
export class BetsModule {}
