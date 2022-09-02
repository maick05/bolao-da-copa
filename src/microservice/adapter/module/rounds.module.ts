import { forwardRef, Module } from '@nestjs/common';
import { RoundsMongoose } from '../repository/rounds/rounds.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Round, RoundsSchema } from '../../domain/schemas/rounds.schema';
import { RoundsController } from '../controller/rounds.controller';
import { GetActualRoundService } from '../../domain/service/rounds/get-actual-round.service';
import { GetRoundsByCompetitionService } from '../../domain/service/rounds/get-rounds-by-competition.service';
import { JoinService } from '../../domain/service/join.service';
import { BetsModule } from './bets.module';
import { TeamsModule } from './teams.module';
import { UsersModule } from './users.module';
import { AuthJwtModule } from './auth-jwt.module';

@Module({
  imports: [
    forwardRef(() => BetsModule),
    TeamsModule,
    UsersModule,
    AuthJwtModule,
    MongooseModule.forFeature([{ name: Round.name, schema: RoundsSchema }])
  ],
  controllers: [RoundsController],
  providers: [
    RoundsMongoose,
    GetActualRoundService,
    GetRoundsByCompetitionService,
    JoinService
  ],
  exports: [
    RoundsMongoose,
    GetActualRoundService,
    GetRoundsByCompetitionService,
    JoinService,
    MongooseModule.forFeature([{ name: Round.name, schema: RoundsSchema }])
  ]
})
export class RoundsModule {}
