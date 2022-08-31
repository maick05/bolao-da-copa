import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RoundsMongoose } from '../../../adapter/repository/rounds.repository';

import { GetActualRoundDTO } from '../../model/dto/rounds/get-actual-round.dto';
import { Match, Round } from '../../schemas/rounds.schema';

@Injectable()
export class GetActualRoundService extends AbstractService {
  constructor(protected readonly roundsRepository: RoundsMongoose) {
    super();
  }

  async getActualRound(getRoundDTO: GetActualRoundDTO): Promise<any> {
    const round = await this.getRound(getRoundDTO);

    const matches = this.sortAndSplitMatches(round.matches);

    return matches;
  }

  async getRound(getRoundDTO: GetActualRoundDTO): Promise<Round> {
    let round = await this.roundsRepository.getActualRound(
      getRoundDTO.idCompetition,
      getRoundDTO.edition
    );

    if (round.length === 0) {
      round = await this.roundsRepository.find(
        {
          idCompetition: getRoundDTO.idCompetition,
          edition: getRoundDTO.edition,
          id: 1
        },
        { matches: 1 },
        {},
        false
      );
    }

    if (round.length === 0) throw new NotFoundException('Round not found!');

    return round[0];
  }

  sortAndSplitMatches(matches: Match[]) {
    matches = matches.sort(function (a, b) {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    const matchesPlayed = matches.filter((match) => {
      return match.scoreHome !== null && match.scoreOutside !== null;
    });

    const nextMatches = matches.filter((match) => {
      return match.scoreHome == null && match.scoreOutside == null;
    });

    return { matchesPlayed, nextMatches };
  }
}
