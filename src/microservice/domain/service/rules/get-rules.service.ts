import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CompetitionsMongoose } from '../../../adapter/repository/competitions.repository';

@Injectable()
export class GetRulesService extends AbstractService {
  constructor(protected readonly competitionsRepository: CompetitionsMongoose) {
    super();
  }

  async getRulesByCompetition(idCompetition: number): Promise<any> {
    return this.competitionsRepository.getRulesCompetition(idCompetition);
  }
}
