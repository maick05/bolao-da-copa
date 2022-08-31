import { Module } from '@nestjs/common';
import { RoundsMongoose } from '../repository/rounds/rounds.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Round, RoundsSchema } from '../../domain/schemas/rounds.schema';
import { RoundsController } from '../controller/rounds.controller';
import { GetActualRoundService } from '../../domain/service/rounds/get-actual-round.service';
import { GetRoundsByCompetitionService } from '../../domain/service/rounds/get-rounds-by-competition.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Round.name, schema: RoundsSchema }])
  ],
  controllers: [RoundsController],
  providers: [
    RoundsMongoose,
    GetActualRoundService,
    GetRoundsByCompetitionService
  ],
  exports: [
    RoundsMongoose,
    GetActualRoundService,
    GetRoundsByCompetitionService,
    MongooseModule.forFeature([{ name: Round.name, schema: RoundsSchema }])
  ]
})
export class RoundsModule {}
