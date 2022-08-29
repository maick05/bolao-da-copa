import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CompetitionsMongoose } from '../../../adapter/repository/competitions.repository';
import { RoundsMongoose } from '../../../adapter/repository/rounds.repository';
import { GetBetsClassificationDTO } from '../../model/dto/get-bets-classification.dto';
import { Bet } from '../../schemas/rounds.schema';
import { UsersService } from '../users/users.service';
import { CalculateBetsScoreService } from './calculate-bets-score.service';

@Injectable()
export class GetBetsClassificationService extends AbstractService {
  constructor(
    protected readonly roundsRepository: RoundsMongoose,
    protected readonly competitionsRepository: CompetitionsMongoose,
    protected readonly calculateBetsService: CalculateBetsScoreService,
    protected readonly usersService: UsersService
  ) {
    super();
  }

  async getClassificationBets(bet: GetBetsClassificationDTO) {
    const arrSum = {};

    const bets = await this.roundsRepository.getBetsByCompetition(
      bet.idCompetition
    );

    bets.forEach((bet: Bet) => {
      if (typeof arrSum[bet.idUser] == 'undefined') arrSum[bet.idUser] = 0;
      arrSum[bet.idUser] += bet.scoreBet;
    });

    const arrSumUser = Object.keys(arrSum)
      .map((index) => {
        return {
          user: index,
          points: arrSum[index]
        };
      })
      .sort();

    const response = [];

    for await (const itemUser of arrSumUser) {
      itemUser.user = await this.getUserInfo(Number(itemUser.user));
      response.push(itemUser);
    }

    return arrSumUser;
  }

  async getUserInfo(id: number): Promise<string> {
    const user = await this.usersService.getUserById(id);
    if (!user) {
      throw new NotFoundException(`User not found!`);
    }
    return user.name;
  }
}
