import { NotFoundException } from '@devseeder/microservices-exceptions';
import { Injectable } from '@nestjs/common';
import { RoundsMongoose } from '../../../adapter/repository/rounds/rounds.repository';

import { GetRoundDTO } from '../../model/dto/rounds/get-round.dto';
import { Match, Round } from '../../schemas/rounds.schema';
import { JoinService } from '../join.service';
import { RoundsService } from './rounds.service';

@Injectable()
export class GetActualRoundService extends RoundsService {
  constructor(
    protected readonly roundsRepository: RoundsMongoose,
    protected readonly joinService: JoinService
  ) {
    super(roundsRepository, joinService);
  }

  async getActualRound(getRoundDTO: GetRoundDTO): Promise<any> {
    const round = await this.getRound(getRoundDTO);
    const matches = await this.joinService.joinMatchesAndBets(round.matches);
    return this.sortAndSplitMatches(matches, round);
  }

  async getRound(getRoundDTO: GetRoundDTO): Promise<Round> {
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
        { id: 1, name: 1, matches: 1 },
        {},
        false
      );
    }

    if (round.length === 0) throw new NotFoundException('Round');

    return round[0];
  }
}
