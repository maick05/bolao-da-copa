import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RoundsMongoose } from '../../../adapter/repository/rounds/rounds.repository';

import { GetRoundDTO } from '../../model/dto/rounds/get-round.dto';
import { Match, Round } from '../../schemas/rounds.schema';

@Injectable()
export class GetRoundsByCompetitionService extends AbstractService {
  constructor(protected readonly roundsRepository: RoundsMongoose) {
    super();
  }

  async getRoundsByCompetition(getRoundDTO: GetRoundDTO): Promise<any> {
    return this.roundsRepository.find(
      {
        idCompetition: getRoundDTO.idCompetition,
        edition: getRoundDTO.edition
      },
      {},
      { id: 1 },
      false
    );
  }

  async getMatchesByRound(getRoundDTO: GetRoundDTO): Promise<any> {
    const res = await this.roundsRepository.find(
      {
        id: getRoundDTO.idRound,
        idCompetition: getRoundDTO.idCompetition,
        edition: getRoundDTO.edition
      },
      { matches: 1 },
      {},
      false
    );

    if (res.length === 0) {
      throw new NotFoundException('Round not found');
    }

    return res[0].matches.sort(function (a, b) {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }
}
