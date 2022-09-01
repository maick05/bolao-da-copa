import { Injectable, NotAcceptableException } from '@nestjs/common';
import { LeaguesMongoose } from 'src/microservice/adapter/repository/leagues.repository';
import { UpdateLeagueDTO } from '../../model/dto/leagues/update-league.dto';
import { BetRules } from '../../schemas/competitions.schema';
import { UsersService } from '../users/users.service';
import { LeagueService } from './league.service';

@Injectable()
export class DeleteLeagueService extends LeagueService {
  constructor(
    protected readonly leagueRepository: LeaguesMongoose,
    protected readonly userService: UsersService
  ) {
    super(leagueRepository, userService);
  }

  async deleteLeague(id: number): Promise<any> {
    await this.validateLeague(id);
    await this.leagueRepository.deleteOneById(id);
  }
}
