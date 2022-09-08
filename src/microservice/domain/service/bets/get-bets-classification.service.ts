import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { BetsMongoose } from '../../../adapter/repository/rounds/bets.repository';
import { CompetitionsMongoose } from '../../../adapter/repository/competitions.repository';
import {
  GetBetsClassificationDTO,
  GetBetsClassificationRoundDTO
} from '../../model/dto/bets/get-bets-classification.dto';
import { Bet } from '../../schemas/rounds.schema';
import { CreateUserService } from '../users/create-user.service';
import { CalculateBetsScoreService } from './calculate-bets-score.service';
import { LeaguesMongoose } from '../../../adapter/repository/leagues.repository';
import { CustomErrorException } from '@devseeder/microservices-exceptions';
import { User } from '../../schemas/users.schema';

@Injectable()
export class GetBetsClassificationService extends AbstractService {
  constructor(
    protected readonly betsRepository: BetsMongoose,
    protected readonly leaguesRepository: LeaguesMongoose,
    protected readonly competitionsRepository: CompetitionsMongoose,
    protected readonly calculateBetsService: CalculateBetsScoreService,
    protected readonly usersService: CreateUserService
  ) {
    super();
  }

  async getLeague(idLeague: number) {
    const league = await this.leaguesRepository.getById(idLeague);

    if (!league)
      throw new CustomErrorException(
        'League Not Found!',
        HttpStatus.NOT_FOUND,
        HttpStatus.NOT_FOUND
      );

    return league;
  }

  async getClassificationBetsByLeague(idLeague: number) {
    const { idCompetition, edition, userIds } = await this.getLeague(idLeague);

    const bets = await this.betsRepository.getBetsByCompetition(
      idCompetition,
      edition
    );

    return this.generateClassificationBets(bets, userIds, idLeague);
  }

  async getClassificationRoundBetsByLeague(idLeague: number, idRound: number) {
    const { idCompetition, edition, userIds } = await this.getLeague(idLeague);

    const bets = await this.betsRepository.getBetsByCompetitionAndRound(
      idCompetition,
      edition,
      idRound
    );

    return this.generateClassificationBets(bets, userIds, idLeague);
  }

  async getClassificationBets(getDTO: GetBetsClassificationDTO) {
    const bets = await this.betsRepository.getBetsByCompetition(
      getDTO.idCompetition,
      getDTO.edition
    );

    return this.generateClassificationBets(bets);
  }

  async getClassificationRoundBets(getDTO: GetBetsClassificationRoundDTO) {
    const bets = await this.betsRepository.getBetsByCompetitionAndRound(
      getDTO.idCompetition,
      getDTO.edition,
      getDTO.idRound
    );

    return this.generateClassificationBets(bets);
  }

  private async generateClassificationBets(
    bets: Bet[],
    userIds: number[] = [],
    idLeague = 0
  ): Promise<Array<any>> {
    const arrSum = {};

    userIds.forEach((id) => {
      arrSum[id] = {
        points: 0,
        exactlyMatch: 0,
        winner: 0,
        oneScore: 0
      };
    });

    bets
      .filter((bet) => bet.scoreBet.length > 0)
      .filter((bet) =>
        userIds.length > 0 ? userIds.indexOf(bet.idUser) !== -1 : true
      )
      .forEach((bet: Bet) => {
        if (idLeague > 0) {
          const betFilter = bet.scoreBet.filter(
            (betScore) => betScore.idLeague == idLeague
          )[0];
          arrSum[bet.idUser].points += betFilter.scoreBet;
          arrSum[bet.idUser].exactlyMatch += betFilter.exactlyMatch ? 1 : 0;
          arrSum[bet.idUser].oneScore += betFilter.oneScore ? 1 : 0;
          arrSum[bet.idUser].winner += betFilter.winner ? 1 : 0;
        } else {
          const betFilter = bet.scoreBet[0];
          arrSum[bet.idUser].points += betFilter.scoreBet;
          arrSum[bet.idUser].exactlyMatch += betFilter.exactlyMatch ? 1 : 0;
          arrSum[bet.idUser].oneScore += betFilter.oneScore ? 1 : 0;
          arrSum[bet.idUser].winner += betFilter.winner ? 1 : 0;
        }
      });

    const arrSumUser = Object.keys(arrSum)
      .map((index) => {
        return {
          user: index,
          ...arrSum[index]
        };
      })
      .sort();

    const response = [];

    for await (const itemUser of arrSumUser) {
      const userInfo = await this.getUserInfo(Number(itemUser.user));
      itemUser.user = userInfo.name;
      itemUser.userId = userInfo.id;
      itemUser.userEmail = userInfo.username;
      response.push(itemUser);
    }

    return arrSumUser;
  }

  async getUserInfo(id: number): Promise<User> {
    const user = await this.usersService.getUserById(id);
    if (!user) {
      throw new CustomErrorException(
        'User Not Found!',
        HttpStatus.NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }
    return user;
  }
}
