import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { Injectable } from '@nestjs/common';
import { CompetitionsMongoose } from '../../adapter/repository/competitions.repository';
import { RoundsMongoose } from '../../adapter/repository/rounds.repository';
import { GetBetsClassificationDTO } from '../model/dto/get-bets-classification.dto';
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

    return [];
  }

  getBetsResults;
}
