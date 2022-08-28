import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { Injectable } from '@nestjs/common';
import { CompetitionsMongoose } from '../../adapter/repository/competitions.repository';
import { RoundsMongoose } from '../../adapter/repository/rounds.repository';
import { Score } from '../interface/score.interface';
import { SetMatchResultDTO } from '../model/dto/set-match-result.dto';
import { BetRules } from '../schemas/competitions.schema';
import { Bet } from '../schemas/rounds.schema';

@Injectable()
export class CalculateBetsScoreService extends AbstractService {
  constructor(
    protected readonly roundsRepository: RoundsMongoose,
    protected readonly competitionRepository: CompetitionsMongoose
  ) {
    super();
  }

  async calculateScoreByMatchResult(
    matchResultDTO: SetMatchResultDTO,
    bets: Bet[]
  ) {
    const rules = await this.competitionRepository.getRulesCompetition(
      matchResultDTO.idCompetition
    );

    const arrScore = {};
    bets.forEach(async (bet: Bet) => {
      arrScore[bet.idUser] = await this.calculateScore(
        bet,
        matchResultDTO,
        rules
      );
    });

    return arrScore;
  }

  calculateScore(bet: Bet, score: Score, rules: BetRules) {
    if (
      bet.scoreHome == score.scoreHome &&
      bet.scoreOutside == score.scoreOutside
    ) {
      return rules.exactlyMatch;
    }

    let points = 0;

    if (
      bet.scoreHome == score.scoreHome ||
      bet.scoreOutside == score.scoreOutside
    ) {
      points += rules.oneScore;
    }

    if (this.checkWinnerAssert(bet, score)) points += rules.winner;

    if (this.checkDrawAssert(bet, score)) points += rules.winner;

    return points;
  }

  checkWinnerAssert(bet: Bet, score: Score): boolean {
    if (
      bet.scoreHome > bet.scoreOutside &&
      score.scoreHome > score.scoreOutside
    )
      return true;

    if (
      bet.scoreHome < bet.scoreOutside &&
      score.scoreHome < score.scoreOutside
    )
      return true;

    return false;
  }

  checkDrawAssert(bet: Bet, score: Score): boolean {
    return (
      bet.scoreHome == bet.scoreOutside && score.scoreHome == score.scoreOutside
    );
  }
}
