import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards
} from '@nestjs/common';
import { UpdateLeagueDTO } from '../../domain/model/dto/leagues/update-league.dto';
import { BetRules } from '../../domain/schemas/competitions.schema';
import { League } from '../../domain/schemas/leagues.schema';
import { DeleteLeagueService } from '../../domain/service/leagues/delete-league.service';
import { GetLeagueService } from '../../domain/service/leagues/get-league.service';
import { UpdateLeagueService } from '../../domain/service/leagues/update-league.service';
import { CreateLeagueDTO } from '../../domain/model/dto/leagues/create-league.dto';
import { CreateLeagueService } from '../../domain/service/leagues/create-league.service';
import { Scopes } from '@devseeder/nestjs-microservices-core';
import { EnumScopes } from '../../domain/enum/enum-scopes.enum';
import { MyJwtAuthGuard } from '../../../core/auth/jwt.auth';

@Controller('leagues')
export class LeaguesController {
  constructor(
    private readonly createLeagueService: CreateLeagueService,
    private readonly updateLeagueService: UpdateLeagueService,
    private readonly deleteLeagueService: DeleteLeagueService,
    private readonly getLeagueService: GetLeagueService
  ) {}

  @UseGuards(MyJwtAuthGuard)
  @Scopes(EnumScopes.USER)
  @Post('/create')
  createLeague(
    @Param('id') id: number,
    @Body() league: CreateLeagueDTO
  ): Promise<void> {
    return this.createLeagueService.createLeague(league);
  }

  @UseGuards(MyJwtAuthGuard)
  @Scopes(EnumScopes.USER)
  @Post('/update/:id')
  update(
    @Param('id') id: number,
    @Body() league: UpdateLeagueDTO
  ): Promise<void> {
    return this.updateLeagueService.updateNameLeague(id, league);
  }

  @UseGuards(MyJwtAuthGuard)
  @Scopes(EnumScopes.USER)
  @Post('/update/rules/:id')
  updateRules(@Param('id') id: number, @Body() rules: BetRules): Promise<void> {
    return this.updateLeagueService.updateRulesLeague(id, rules);
  }

  @UseGuards(MyJwtAuthGuard)
  @Scopes(EnumScopes.USER)
  @Post('/update/users/add/:id')
  updateAddUsers(
    @Param('id') id: number,
    @Body() userIds: number[]
  ): Promise<void> {
    return this.updateLeagueService.updateAddUserToLeague(id, userIds);
  }

  @UseGuards(MyJwtAuthGuard)
  @Scopes(EnumScopes.USER)
  @Post('/update/users/remove/:id')
  updateRemoveUsers(
    @Param('id') id: number,
    @Body() userIds: number[]
  ): Promise<void> {
    return this.updateLeagueService.updateRemoveUserToLeague(id, userIds);
  }

  @UseGuards(MyJwtAuthGuard)
  @Scopes(EnumScopes.USER)
  @Delete('/delete/:id')
  deleteLeague(@Param('id') id: number): Promise<void> {
    return this.deleteLeagueService.deleteLeague(id);
  }

  @UseGuards(MyJwtAuthGuard)
  @Scopes(EnumScopes.USER)
  @Get('/details/:id')
  getLeagueById(@Param('id') id: number): Promise<League> {
    return this.getLeagueService.getLeagueById(id);
  }

  @UseGuards(MyJwtAuthGuard)
  @Scopes(EnumScopes.USER)
  @Get('/user/:id')
  getLeaguesByUser(@Param('id') id: number): Promise<League[]> {
    return this.getLeagueService.getLeaguesByUserAdm(id);
  }
}
