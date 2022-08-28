import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { Injectable } from '@nestjs/common';
import { CompetitionsMongoose } from '../../adapter/repository/competitions.repository';
import { RoundsMongoose } from '../../adapter/repository/rounds.repository';
import { GetBetsClassificationDTO } from '../model/dto/get-bets-classification.dto';
import { Bet } from '../schemas/rounds.schema';
import { CalculateBetsScoreService } from './calculate-bets-score.service';

@Injectable()
export class GetBetsClassificationService extends AbstractService {
  constructor(
    protected readonly roundsRepository: RoundsMongoose,
    protected readonly competitionsRepository: CompetitionsMongoose,
    protected readonly calculateBetsService: CalculateBetsScoreService
  ) {
    super();
  }

  async getClassificationBets(bet: GetBetsClassificationDTO) {
    const arrSum = [];

    const bets = await this.roundsRepository.getBetsByCompetition(
      bet.idCompetition
    );

    bets.forEach((bet: Bet) => {
      if (typeof arrSum[bet.idUser] == 'undefined') arrSum[bet.idUser] = 0;
      arrSum[bet.idUser] += bet.scoreBet;
    });

    return arrSum.filter((item) => item != null);
  }

  getBetsResults;
}
