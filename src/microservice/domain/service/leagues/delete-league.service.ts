import { Injectable } from '@nestjs/common';
import { LeaguesMongoose } from '../../../adapter/repository/leagues.repository';
import { CreateUserService } from '../users/create-user.service';
import { LeagueService } from './league.service';

@Injectable()
export class DeleteLeagueService extends LeagueService {
  constructor(
    protected readonly leagueRepository: LeaguesMongoose,
    protected readonly userService: CreateUserService
  ) {
    super(leagueRepository, userService);
  }

  async deleteLeague(id: number): Promise<any> {
    await this.validateLeague(id);
    await this.leagueRepository.deleteOneById(id);
  }
}
