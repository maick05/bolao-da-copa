import { NotFoundException } from '@devseeder/microservices-exceptions';
import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { Injectable } from '@nestjs/common';
import { RoundsMongoose } from '../../../adapter/repository/rounds/rounds.repository';

import { GetRoundDTO } from '../../model/dto/rounds/get-round.dto';
import { Match, Round } from '../../schemas/rounds.schema';
import { JoinService } from '../join.service';

@Injectable()
export class GetRoundsByCompetitionService extends AbstractService {
  constructor(
    protected readonly roundsRepository: RoundsMongoose,
    protected readonly joinService: JoinService
  ) {
    super();
  }

  async getRoundsByCompetition(getRoundDTO: GetRoundDTO): Promise<any> {
    const rounds = await this.roundsRepository.find(
      {
        idCompetition: getRoundDTO.idCompetition,
        edition: getRoundDTO.edition
      },
      {},
      { id: 1 },
      false
    );
    return this.joinService.joinRounds(rounds);
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
      throw new NotFoundException('Round');
    }

    const matches = await this.joinService.joinMatchesAndBets(res[0].matches);

    return matches.sort(function (a, b) {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }
}
