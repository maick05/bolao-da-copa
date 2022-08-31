import { Controller, Get, Param } from '@nestjs/common';
import { GetActualRoundService } from 'src/microservice/domain/service/rounds/get-actual-round.service';
import { GetActualRoundDTO } from 'src/microservice/domain/model/dto/rounds/get-actual-round.dto';

@Controller('rounds')
export class RoundsController {
  constructor(private readonly getActualRoundService: GetActualRoundService) {}

  @Get('/actual/:idCompetition/:edition')
  getBetsClassification(@Param() getDTO: GetActualRoundDTO): Promise<any[]> {
    return this.getActualRoundService.getActualRound(getDTO);
  }
}
