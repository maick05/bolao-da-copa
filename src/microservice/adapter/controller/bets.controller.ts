import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PushBetDTO } from '../../domain/model/dto/push-bet.dto';
import { PushBetService } from '../../domain/service/push-bet.service';
import { SetMatchResultDTO } from '../../domain/model/dto/set-match-result.dto';
import { GetBetsDTO } from '../../domain/model/dto/get-bets.dto';
import { GetBetsClassificationService } from '../../domain/service/get-bets-classification.service';
import { GetBetsClassificationDTO } from 'src/microservice/domain/model/dto/get-bets-classification.dto';

@Controller('bets')
export class BetsController {
  constructor(
    private readonly betService: PushBetService,
    private readonly getBetsClassificationService: GetBetsClassificationService
  ) {}

  @Post('/push')
  pushBets(@Body() bet: PushBetDTO): Promise<void> {
    return this.betService.pushBet(bet);
  }

  @Post('/setMatchResult')
  setMatchResult(@Body() bet: SetMatchResultDTO): Promise<void> {
    return this.betService.setMatchResult(bet);
  }

  @Get('/bets/:idCompetition/:edition')
  getBetsClassification(
    @Param() bet: GetBetsClassificationDTO
  ): Promise<any[]> {
    return this.getBetsClassificationService.getClassificationBets(bet);
  }
}
