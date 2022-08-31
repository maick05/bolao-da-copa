import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CompetitionsMongoose } from 'src/microservice/adapter/repository/competitions.repository';
import { GetCompetitionDTO } from '../../model/dto/competition/get-competition.dto';

import { GetRoundDTO } from '../../model/dto/rounds/get-round.dto';
import { Match, Round } from '../../schemas/rounds.schema';

@Injectable()
export class GetRulesService extends AbstractService {
  constructor(protected readonly competitionsRepository: CompetitionsMongoose) {
    super();
  }

  async getRulesByCompetition(idCompetition: number): Promise<any> {
    return this.competitionsRepository.getRulesCompetition(idCompetition);
  }
}
