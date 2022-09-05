import { Module } from '@nestjs/common';
import { AuthJwtModule } from './auth-jwt.module';
import { LeaguesModule } from './league.module';
import { BetsModule } from './bets.module';
import { RecalculationService } from '../../domain/service/classification/recalculation.service';
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
