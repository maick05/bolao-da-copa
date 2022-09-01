import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UpdateLeagueDTO } from 'src/microservice/domain/model/dto/leagues/update-league.dto';
import { BetRules } from 'src/microservice/domain/schemas/competitions.schema';
import { UpdateLeagueService } from 'src/microservice/domain/service/leagues/update-league.service';
import { CreateLeagueDTO } from '../../domain/model/dto/leagues/create-league.dto';
import { CreateLeagueService } from '../../domain/service/leagues/create-league.service';

@Controller('leagues')
export class LeaguesController {
  constructor(
    private readonly createLeagueService: CreateLeagueService,
    private readonly updateLeagueService: UpdateLeagueService
  ) {}

  @Post('/create')
  createLeague(
    @Param('id') id: number,
    @Body() league: CreateLeagueDTO
  ): Promise<void> {
    return this.createLeagueService.createLeague(league);
  }

  @Post('/update/:id')
  update(
    @Param('id') id: number,
    @Body() league: UpdateLeagueDTO
  ): Promise<void> {
    return this.updateLeagueService.updateNameLeague(id, league);
  }

  @Post('/update/rules/:id')
  updateRules(@Param('id') id: number, @Body() rules: BetRules): Promise<void> {
    return this.updateLeagueService.updateRulesLeague(id, rules);
  }

  @Post('/update/users/add/:id')
  updateAddUsers(
    @Param('id') id: number,
    @Body() userIds: number[]
  ): Promise<void> {
    return this.updateLeagueService.updateAddUserToLeague(id, userIds);
  }

  @Post('/update/users/remove/:id')
  updateRemoveUsers(
    @Param('id') id: number,
    @Body() userIds: number[]
  ): Promise<void> {
    return this.updateLeagueService.updateRemoveUserToLeague(id, userIds);
  }
}
