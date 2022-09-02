import { Injectable, NotAcceptableException } from '@nestjs/common';
import { LeaguesMongoose } from '../../../adapter/repository/leagues.repository';
import { UpdateLeagueDTO } from '../../model/dto/leagues/update-league.dto';
import { BetRules } from '../../schemas/competitions.schema';
import { CreateUserService } from '../users/create-user.service';
import { LeagueService } from './league.service';

@Injectable()
export class UpdateLeagueService extends LeagueService {
  constructor(
    protected readonly leagueRepository: LeaguesMongoose,
    protected readonly userService: CreateUserService
  ) {
    super(leagueRepository, userService);
  }

  async updateNameLeague(id: number, league: UpdateLeagueDTO): Promise<any> {
    await this.validateLeague(id);
    await this.leagueRepository.updateOne(
      {
        id
      },
      { name: league.name }
    );
  }

  async updateRulesLeague(id: number, rules: BetRules): Promise<any> {
    await this.validateLeague(id);
    await this.leagueRepository.updateRules(id, rules);
  }

  async updateAddUserToLeague(id: number, userIds: number[]): Promise<any> {
    await this.validateLeague(id);

    await this.validateUsers(userIds);

    const league = await this.leagueRepository.getById(id);

    userIds.forEach((userId) => {
      if (league.userIds.indexOf(userId) !== -1)
        throw new NotAcceptableException(
          `User '${userId}' already found in league`
        );
    });

    await this.leagueRepository.updateAddUser(id, userIds);
  }

  async updateRemoveUserToLeague(id: number, userIds: number[]): Promise<any> {
    await this.validateLeague(id);

    await this.validateUsers(userIds);

    const league = await this.leagueRepository.getById(id);

    userIds.forEach((userId) => {
      if (league.userIds.indexOf(userId) == -1)
        throw new NotAcceptableException(
          `User '${userId}' not found in league`
        );
    });

    await this.leagueRepository.updateRemoveUser(id, userIds);
  }
}
