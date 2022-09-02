import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { GetActualRoundService } from '../../domain/service/rounds/get-actual-round.service';
import { GetRoundDTO } from '../../domain/model/dto/rounds/get-round.dto';
import { GetRoundsByCompetitionService } from '../../domain/service/rounds/get-rounds-by-competition.service';
import { EnumScopes } from '../../domain/enum/enum-scopes.enum';
import { MyJwtAuthGuard } from '../../../core/auth/jwt.auth';
import { Scopes } from '@devseeder/nestjs-microservices-core';

@Controller('rounds')
export class RoundsController {
  constructor(
    private readonly getActualRoundService: GetActualRoundService,
    private readonly getRoundsByCompetitionService: GetRoundsByCompetitionService
  ) {}

  @UseGuards(MyJwtAuthGuard)
  @Scopes(EnumScopes.USER)
  @Get('/actual/:idCompetition/:edition')
  getActualRound(@Param() getDTO: GetRoundDTO): Promise<any[]> {
    return this.getActualRoundService.getActualRound(getDTO);
  }

  @UseGuards(MyJwtAuthGuard)
  @Scopes(EnumScopes.USER)
  @Get('/competition/:idCompetition/:edition')
  getRoundsByCompetition(@Param() getDTO: GetRoundDTO): Promise<any[]> {
    return this.getRoundsByCompetitionService.getRoundsByCompetition(getDTO);
  }

  @UseGuards(MyJwtAuthGuard)
  @Scopes(EnumScopes.USER)
  @Get('/matches/:idRound/:idCompetition/:edition')
  getMatchesByRound(@Param() getDTO: GetRoundDTO): Promise<any[]> {
    return this.getRoundsByCompetitionService.getMatchesByRound(getDTO);
  }
}
