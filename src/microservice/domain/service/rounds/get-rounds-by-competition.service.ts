import { NotFoundException } from '@devseeder/microservices-exceptions';
import { Injectable } from '@nestjs/common';
import { RoundsMongoose } from '../../../adapter/repository/rounds/rounds.repository';
import { GetRoundDTO } from '../../model/dto/rounds/get-round.dto';
import { JoinService } from '../join.service';
import { RoundsService } from './rounds.service';

@Injectable()
export class GetRoundsByCompetitionService extends RoundsService {
  constructor(
    protected readonly roundsRepository: RoundsMongoose,
    protected readonly joinService: JoinService
  ) {
    super(roundsRepository, joinService);
  }

  async getRoundsByCompetition(getRoundDTO: GetRoundDTO): Promise<any> {
    const rounds = await this.roundsRepository.find(
      {
        idCompetition: getRoundDTO.idCompetition,
        edition: getRoundDTO.edition
      },
      { id: 1, name: 1, idStage: 1 },
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
      { matches: 1, id: 1, name: 1 },
      {},
      false
    );

    if (res.length === 0) {
      throw new NotFoundException('Round');
    }

    const matches = await this.joinService.joinMatchesAndBets(res[0].matches);

    return this.sortAndSplitMatches(matches, res[0]);
  }
}
