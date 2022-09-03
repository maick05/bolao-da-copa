import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { Injectable } from '@nestjs/common';
import { CompetitionsMongoose } from '../../../adapter/repository/competitions.repository';
import { RoundsMongoose } from '../../../adapter/repository/rounds/rounds.repository';
import { Score } from '../../interface/score.interface';
import { SetMatchResultDTO } from '../../model/dto/set-match-result.dto';
import { BetRules } from '../../schemas/competitions.schema';
import { Bet, ScoreBet } from '../../schemas/rounds.schema';
import { GetLeagueService } from '../leagues/get-league.service';

@Injectable()
export class CalculateBetsScoreService extends AbstractService {
  constructor(
    protected readonly competitionRepository: CompetitionsMongoose,
    protected readonly getLeagueService: GetLeagueService
  ) {
    super();
  }

  async calculateScoreByMatchResult(
    matchResultDTO: SetMatchResultDTO,
    bets: Bet[]
  ): Promise<any> {
    const arrScore = {};
    for await (const bet of bets) {
      arrScore[bet.idUser] = [];
      const leagues = await this.getLeagueService.getByUserId(bet.idUser);
      for await (const league of leagues) {
        const score = await this.calculateScore(
          bet,
          matchResultDTO,
          league.rules
        );
        score.idLeague = league.id;
        arrScore[bet.idUser].push(score);
      }
    }

    return arrScore;
  }

  calculateScore(bet: Bet, score: Score, rules: BetRules): ScoreBet {
    const scoreBet = new ScoreBet();

    if (
      bet.scoreHome == score.scoreHome &&
      bet.scoreOutside == score.scoreOutside
    ) {
      scoreBet.exactlyMatch = true;
      scoreBet.oneScore = true;
      scoreBet.winner = true;
      scoreBet.scoreBet = rules.exactlyMatch;
      return scoreBet;
    }

    let points = 0;

    if (
      bet.scoreHome == score.scoreHome ||
      bet.scoreOutside == score.scoreOutside
    ) {
      points += rules.oneScore;
      scoreBet.oneScore = true;
    }

    if (this.checkWinnerAssert(bet, score)) {
      points += rules.winner;
      scoreBet.winner = true;
    }

    if (this.checkDrawAssert(bet, score)) {
      points += rules.winner;
      scoreBet.winner = true;
    }

    scoreBet.scoreBet = points;
    return scoreBet;
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
