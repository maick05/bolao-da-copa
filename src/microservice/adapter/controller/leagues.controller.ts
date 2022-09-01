import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateLeagueDTO } from '../../domain/model/dto/leagues/create-league.dto';
import { CreateLeagueService } from '../../domain/service/leagues/create-league.service';

@Controller('leagues')
export class LeaguesController {
  constructor(private readonly createLeagueService: CreateLeagueService) {}

  @Post('/create')
  getRules(@Body() league: CreateLeagueDTO): Promise<void> {
    return this.createLeagueService.createLeague(league);
  }
}
