import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { League, LeaguesSchema } from '../../domain/schemas/leagues.schema';
import { LeaguesMongoose } from '../repository/leagues.repository';
import { LeaguesController } from '../controller/leagues.controller';
import { CreateLeagueService } from '../../domain/service/leagues/create-league.service';
import { GetRulesService } from '../../domain/service/rules/get-rules.service';
import { UsersModule } from './users.module';
import { CompetitionsModule } from './competitions.module';
import { UpdateLeagueService } from '../../domain/service/leagues/update-league.service';
import { DeleteLeagueService } from '../../domain/service/leagues/delete-league.service';
import { GetLeagueService } from '../../domain/service/leagues/get-league.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: League.name, schema: LeaguesSchema }]),
    CompetitionsModule,
    UsersModule
  ],
  controllers: [LeaguesController],
  providers: [
    LeaguesMongoose,
    CreateLeagueService,
    GetRulesService,
    UpdateLeagueService,
    DeleteLeagueService,
    GetLeagueService
  ],
  exports: [LeaguesMongoose, CreateLeagueService, GetLeagueService]
})
export class LeaguesModule {}
