import { Scopes } from '@devseeder/nestjs-microservices-core';
import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../../domain/decorators/get-user.decorator';
import { MyJwtAuthGuard } from '../../../core/auth/jwt.auth';
import { EnumScopes } from '../../domain/enum/enum-scopes.enum';
import { BetRules } from '../../domain/schemas/competitions.schema';
import { RecalculationService } from '../../domain/service/classification/recalculation.service';

@Controller('classification')
export class ClassificationController {
  constructor(private readonly recalculationService: RecalculationService) {}

  @UseGuards(MyJwtAuthGuard)
  @Scopes(EnumScopes.USER)
  @Post('/update/rules/league/:id')
  updateRules(
    @Param('id') id: number,
    @Body() rules: BetRules,
    @GetUser() user
  ): Promise<void> {
    return this.recalculationService.recalculateRulesLeague(id, rules, user);
  }
}
