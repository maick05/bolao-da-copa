import { Injectable } from '@nestjs/common';
import { LeaguesMongoose } from '../../../adapter/repository/leagues.repository';
import { CreateUserService } from '../users/create-user.service';
import { GetLeagueService } from './get-league.service';
import { LeagueService } from './league.service';

@Injectable()
export class DeleteLeagueService extends LeagueService {
  constructor(
    protected readonly leagueRepository: LeaguesMongoose,
    protected readonly createUserService: CreateUserService,
    protected readonly getLeagueService: GetLeagueService
  ) {
    super(leagueRepository, createUserService);
  }

  async deleteLeague(id: number, username: string): Promise<any> {
    await this.validateLeague(id);
    await this.getLeagueService.validateAdmLeague(username, id);
    await this.leagueRepository.deleteOneById(id);
  }
}
