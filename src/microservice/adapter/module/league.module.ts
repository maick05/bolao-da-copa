import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { League, LeaguesSchema } from '../../domain/schemas/leagues.schema';
import { LeaguesMongoose } from '../repository/leagues.repository';
import { LeaguesController } from '../controller/leagues.controller';
import { CreateLeagueService } from '../../domain/service/leagues/create-league.service';
import { GetRulesService } from '../../domain/service/rules/get-rules.service';
import { UsersModule } from './users.module';
import { CompetitionsModule } from './competitions.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: League.name, schema: LeaguesSchema }]),
    CompetitionsModule,
    UsersModule
  ],
  controllers: [LeaguesController],
  providers: [LeaguesMongoose, CreateLeagueService, GetRulesService],
  exports: [LeaguesMongoose, CreateLeagueService]
})
export class LeaguesModule {}
