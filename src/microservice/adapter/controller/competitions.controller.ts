import { Controller, Get, Param } from '@nestjs/common';
import { GetRulesService } from 'src/microservice/domain/service/rules/get-rules.service';

@Controller('competitions')
export class CompetitionsController {
  constructor(private readonly getRulesService: GetRulesService) {}

  @Get('/rules/:idCompetition/')
  getRules(@Param('idCompetition') idCompetition: number): Promise<any[]> {
    return this.getRulesService.getRulesByCompetition(idCompetition);
  }
}
