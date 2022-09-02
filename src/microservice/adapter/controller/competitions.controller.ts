import { Scopes } from '@devseeder/nestjs-microservices-core';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MyJwtAuthGuard } from '../../../core/auth/jwt.auth';
import { EnumScopes } from '../../domain/enum/enum-scopes.enum';
import { GetRulesService } from '../../domain/service/rules/get-rules.service';

@Controller('competitions')
export class CompetitionsController {
  constructor(private readonly getRulesService: GetRulesService) {}

  @UseGuards(MyJwtAuthGuard)
  @Scopes(EnumScopes.USER)
  @Get('/rules/:idCompetition/')
  getRules(@Param('idCompetition') idCompetition: number): Promise<any[]> {
    return this.getRulesService.getRulesByCompetition(idCompetition);
  }
}
