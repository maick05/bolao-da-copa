import { Injectable, NotAcceptableException } from '@nestjs/common';
import { LeaguesMongoose } from '../../../adapter/repository/leagues.repository';
import { League } from '../../schemas/leagues.schema';
import { UsersService } from '../users/users.service';
import { LeagueService } from './league.service';

@Injectable()
export class GetLeagueService extends LeagueService {
  constructor(
    protected readonly leagueRepository: LeaguesMongoose,
    protected readonly userService: UsersService
  ) {
    super(leagueRepository, userService);
  }

  async getLeagueById(id: number): Promise<League> {
    await this.validateLeague(id);
    return this.leagueRepository.getById(id);
  }

  async getLeagueByIdCompetition(id: number): Promise<League> {
    return this.leagueRepository.getByIdCompetition(id);
  }

  async getLeaguesByUser(idUser: number): Promise<League[]> {
    await this.validateUsers([idUser]);
    return this.leagueRepository.getByUser(idUser);
  }
}
