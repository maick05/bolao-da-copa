import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BetsMongoose } from '../../../adapter/repository/rounds/bets.repository';
import { CompetitionsMongoose } from '../../../adapter/repository/competitions.repository';
import {
  GetBetsClassificationDTO,
  GetBetsClassificationRoundDTO
} from '../../model/dto/bets/get-bets-classification.dto';
import { Bet } from '../../schemas/rounds.schema';
import { UsersService } from '../users/users.service';
import { CalculateBetsScoreService } from './calculate-bets-score.service';
import { LeaguesMongoose } from '../../../adapter/repository/leagues.repository';

@Injectable()
export class GetBetsClassificationService extends AbstractService {
  constructor(
    protected readonly betsRepository: BetsMongoose,
    protected readonly leaguesRepository: LeaguesMongoose,
    protected readonly competitionsRepository: CompetitionsMongoose,
    protected readonly calculateBetsService: CalculateBetsScoreService,
    protected readonly usersService: UsersService
  ) {
    super();
  }

  async getClassificationBets(idLeague: number) {
    const { idCompetition, edition, userIds } = await this.getLeague(idLeague);

    const bets = await this.betsRepository.getBetsByCompetition(
      idCompetition,
      edition
    );

    return this.generateClassificationBets(bets, userIds);
  }

  async getClassificationRoundBets(idLeague: number, idRound: number) {
    const { idCompetition, edition, userIds } = await this.getLeague(idLeague);

    const bets = await this.betsRepository.getBetsByCompetitionAndRound(
      idCompetition,
      edition,
      idRound
    );

    return this.generateClassificationBets(bets, userIds);
  }

  async getLeague(idLeague: number) {
    const league = await this.leaguesRepository.getById(idLeague);

    if (!league) throw new NotFoundException('League Not Found!');

    return league;
  }

  private async generateClassificationBets(
    bets: Bet[],
    userIds: number[]
  ): Promise<Array<any>> {
    const arrSum = {};

    bets
      .filter((bet) => userIds.indexOf(bet.idUser) !== -1)
      .forEach((bet: Bet) => {
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
