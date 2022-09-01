import { Injectable, NotAcceptableException } from '@nestjs/common';
import { LeaguesMongoose } from '../../../adapter/repository/leagues.repository';
import { League } from '../../schemas/leagues.schema';
import { CreateUserService } from '../users/create-user.service';
import { LeagueService } from './league.service';

@Injectable()
export class GetLeagueService extends LeagueService {
  constructor(
    protected readonly leagueRepository: LeaguesMongoose,
    protected readonly userService: CreateUserService
  ) {
    super(leagueRepository, userService);
  }

  async getLeagueById(id: number): Promise<League> {
    await this.validateLeague(id);
    return this.leagueRepository.getById(id);
  }

  async getByUserId(id: number): Promise<League> {
    return this.leagueRepository.getByUserId(id);
  }

  async getLeaguesByUserAdm(idUser: number): Promise<League[]> {
    await this.validateUsers([idUser]);
    return this.leagueRepository.getByUserAdm(idUser);
  }
}
