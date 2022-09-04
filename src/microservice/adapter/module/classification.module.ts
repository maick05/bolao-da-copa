import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompetitionsMongoose } from '../repository/competitions.repository';
import {
  Competition,
  CompetitionsSchema
} from '../../domain/schemas/competitions.schema';
import { CompetitionsController } from '../controller/competitions.controller';
import { AuthJwtModule } from './auth-jwt.module';
import { LeaguesModule } from './league.module';
import { BetsModule } from './bets.module';
import { RecalculationService } from 'src/microservice/domain/service/classification/recalculation.service';
import { RoundsModule } from './rounds.module';
import { ClassificationController } from '../controller/classification.controller';
import { UsersModule } from './users.module';

@Module({
  imports: [
    AuthJwtModule,
    LeaguesModule,
    BetsModule,
    RoundsModule,
    UsersModule
  ],
  controllers: [ClassificationController],
  providers: [RecalculationService],
  exports: [RecalculationService]
})
export class ClassificationModule {}
