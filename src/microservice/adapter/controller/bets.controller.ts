import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PushBetDTO } from '../../domain/model/dto/bets/push-bet.dto';
import { PushBetService } from '../../domain/service/bets/push-bet.service';
import { SetMatchResultDTO } from '../../domain/model/dto/set-match-result.dto';
import { GetBetsClassificationService } from '../../domain/service/bets/get-bets-classification.service';
import {
  GetBetsClassificationDTO,
  GetBetsClassificationRoundDTO
} from '../../domain/model/dto/bets/get-bets-classification.dto';
import { GetBetsDTO } from '../../domain/model/dto/bets/get-bets.dto';
import { GetBetsMatchService as GetBetsByMatchService } from '../../domain/service/bets/get-bets-match.service';

@Controller('bets')
export class BetsController {
  constructor(
    private readonly betService: PushBetService,
    private readonly getBetsClassificationService: GetBetsClassificationService,
    private readonly getBetsByMatchService: GetBetsByMatchService
  ) {}

  @Post('/push')
  pushBets(@Body() bet: PushBetDTO): Promise<void> {
    return this.betService.pushBet(bet);
  }

  @Post('/setMatchResult')
  setMatchResult(@Body() bet: SetMatchResultDTO): Promise<void> {
    return this.betService.setMatchResult(bet);
  }

  @Get('/classification/:idLeague')
  getBetsClassification(@Param('idLeague') idLeague: number): Promise<any[]> {
    return this.getBetsClassificationService.getClassificationBets(idLeague);
  }

  @Get('/classification/:idLeague/:idRound')
  getBetsClassificationRound(
    @Param('idLeague') idLeague: number,
    @Param('idRound') idRound: number
  ): Promise<any[]> {
    return this.getBetsClassificationService.getClassificationRoundBets(
      idLeague,
      idRound
    );
  }

  @Post('/match/:idCompetition/:edition')
  getBetsMyMatch(
    @Param('idCompetition') idCompetition: number,
    @Param('edition') edition: number,
    @Body() getDTO: GetBetsDTO
  ): Promise<any[]> {
    getDTO.idCompetition = idCompetition;
    getDTO.edition = edition;
    return this.getBetsByMatchService.getBetsByMatch(getDTO);
  }
}
