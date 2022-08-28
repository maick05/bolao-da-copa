import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PushBetDTO } from '../../domain/model/dto/push-bet.dto';
import { PushBetService } from '../../domain/service/push-bet.service';
import { SetMatchResultDTO } from '../../domain/model/dto/set-match-result.dto';

@Controller('bets')
export class BetsController {
  constructor(private readonly betService: PushBetService) {}

  @Post('/push')
  pushBets(@Body() bet: PushBetDTO): Promise<void> {
    return this.betService.pushBet(bet);
  }

  @Post('/setMatchResult')
  setMatchResult(@Body() bet: SetMatchResultDTO): Promise<void> {
    return this.betService.setMatchResult(bet);
  }
}
