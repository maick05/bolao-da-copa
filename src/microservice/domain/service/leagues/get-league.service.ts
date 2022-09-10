import {
  ForbiddenException,
  Injectable,
  NotAcceptableException
} from '@nestjs/common';
import { ForbiddenActionException } from '../../../../core/exceptions/forbbiden-action.exception';
import { LeaguesMongoose } from '../../../adapter/repository/leagues.repository';
import { League } from '../../schemas/leagues.schema';
import { CreateUserService } from '../users/create-user.service';
import { GetUserService } from '../users/get-user.service';
import { LeagueService } from './league.service';

@Injectable()
export class GetLeagueService extends LeagueService {
  constructor(
    protected readonly leagueRepository: LeaguesMongoose,
    protected readonly createUserService: CreateUserService,
    protected readonly getUserService: GetUserService
  ) {
    super(leagueRepository, createUserService);
  }

  async getLeagueById(id: number): Promise<League> {
    await this.validateLeague(id);
    const league = await this.leagueRepository.getById(id);
    return this.joinUsersLeague(league);
  }

  async getByUserId(id: number): Promise<League[]> {
    return this.leagueRepository.getByUserId(id);
  }

  async getLeaguesByUserAdm(idUser: number): Promise<League[]> {
    await this.validateUsers([idUser]);
    return this.leagueRepository.getByUserAdm(idUser);
  }

  async getLeaguesByUser(idUser: number): Promise<League[]> {
    await this.validateUsers([idUser]);
    const leagues = await this.leagueRepository.getByUserId(idUser);
    return this.joinAdmLeagues(leagues);
  }

  private async joinUsersLeague(league: League): Promise<League & any> {
    const arrUser = [];
    for await (const userId of league.userIds) {
      const user = await this.getUserService.getUserById(userId);
      arrUser.push({
        id: userId,
        name: user.name,
        email: user.username
      });
    }

    return {
      ...league,
      userADM: (await this.getUserService.getUserById(league.idUserAdm)).name,
      users: arrUser
    };
  }

  private async joinAdmLeagues(leagues: League[]) {
    const arr = [];
    for await (const league of leagues) {
      arr.push({
        ...league,
        userAdm: (await this.getUserService.getUserById(league.idUserAdm)).name
      });
    }

    return arr;
  }

  async validateAdmLeague(username: string, idLeague: number) {
    const user = await this.getUserService.getUserByEmail(username);
    const league = await this.leagueRepository.getById(idLeague);

    if (user.id !== league.idUserAdm)
      throw new ForbiddenActionException(
        'This user is not allowed to perform this action in this league, only the ADM can do it!'
      );
  }
}
