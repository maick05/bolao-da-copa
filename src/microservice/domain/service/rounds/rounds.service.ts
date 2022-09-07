import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { Injectable } from '@nestjs/common';
import { RoundsMongoose } from '../../../adapter/repository/rounds/rounds.repository';
import { Match, Round } from '../../schemas/rounds.schema';
import { JoinService } from '../join.service';

@Injectable()
export class RoundsService extends AbstractService {
  constructor(
    protected readonly roundsRepository: RoundsMongoose,
    protected readonly joinService: JoinService
  ) {
    super();
  }

  sortAndSplitMatches(matches: Match[], round: Round) {
    matches = matches.sort(function (a, b) {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    const matchesPlayed = matches.filter((match) => {
      return (
        match.scoreHome !== null &&
        match.scoreHome > -1 &&
        match.scoreOutside !== null &&
        match.scoreOutside > -1
      );
    });

    const nextMatches = matches.filter((match) => {
      return (
        (match.scoreHome == null || match.scoreHome == -1) &&
        (match.scoreOutside == null || match.scoreOutside == -1)
      );
    });

    return { idRound: round.id, name: round.name, matchesPlayed, nextMatches };
  }
}
