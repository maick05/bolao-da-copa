import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Bet } from '../../domain/schemas/rounds.schema';
import { GetBetsDTO } from '../../domain/model/dto/get-bets.dto';
import { PushBetDTO } from '../../domain/model/dto/push-bet.dto';
import { BetsService } from '../../domain/service/bets.service';
import { SetMatchResultDTO } from 'src/microservice/domain/model/dto/set-match-result.dto';

@Controller('bets')
export class BetsController {
  constructor(private readonly betService: BetsService) {}

  @Post('/push')
  pushBets(@Body() bet: PushBetDTO): Promise<void> {
    return this.betService.pushBet(bet);
  }

  @Get('/match/:idRound/:idTeamHome/:idTeamOutside')
  getBets(@Param() bet: GetBetsDTO): Promise<Bet[]> {
    return this.betService.getBets(bet);
  }

  @Post('/setMatchResult')
  setMatchResult(@Body() bet: SetMatchResultDTO): Promise<void> {
    return this.betService.setMatchResult(bet);
  }
}
