import { Controller, Get, Param } from '@nestjs/common';
import { GetActualRoundService } from '../../domain/service/rounds/get-actual-round.service';
import { GetRoundDTO } from '../../domain/model/dto/rounds/get-round.dto';
import { GetRoundsByCompetitionService } from '../../domain/service/rounds/get-rounds-by-competition.service';

@Controller('rounds')
export class RoundsController {
  constructor(
    private readonly getActualRoundService: GetActualRoundService,
    private readonly getRoundsByCompetitionService: GetRoundsByCompetitionService
  ) {}

  @Get('/actual/:idCompetition/:edition')
  getActualRound(@Param() getDTO: GetRoundDTO): Promise<any[]> {
    return this.getActualRoundService.getActualRound(getDTO);
  }

  @Get('/competition/:idCompetition/:edition')
  getRoundsByCompetition(@Param() getDTO: GetRoundDTO): Promise<any[]> {
    return this.getRoundsByCompetitionService.getRoundsByCompetition(getDTO);
  }

  @Get('/matches/:idRound/:idCompetition/:edition')
  getMatchesByRound(@Param() getDTO: GetRoundDTO): Promise<any[]> {
    return this.getRoundsByCompetitionService.getMatchesByRound(getDTO);
  }
}
