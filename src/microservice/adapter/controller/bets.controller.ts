import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PushBetDTO } from '../../domain/model/dto/bets/push-bet.dto';
import { PushBetService } from '../../domain/service/bets/push-bet.service';
import { SetMatchResultDTO } from '../../domain/model/dto/set-match-result.dto';
import { GetBetsClassificationService } from '../../domain/service/bets/get-bets-classification.service';
import { GetBetsClassificationDTO } from 'src/microservice/domain/model/dto/bets/get-bets-classification.dto';

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

  @Get('/classification/:idCompetition/:edition')
  getBetsClassification(
    @Param() bet: GetBetsClassificationDTO
  ): Promise<any[]> {
    return this.getBetsClassificationService.getClassificationBets(bet);
  }
}
