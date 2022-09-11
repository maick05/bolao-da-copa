import { CustomErrorException } from '@devseeder/microservices-exceptions';
import { HttpStatus, Injectable, NotAcceptableException } from '@nestjs/common';
import { LeaguesMongoose } from '../../../adapter/repository/leagues.repository';
import { UpdateLeagueDTO } from '../../model/dto/leagues/update-league.dto';
import { CreateUserService } from '../users/create-user.service';
import { GetLeagueService } from './get-league.service';
import { LeagueService } from './league.service';

@Injectable()
export class UpdateLeagueService extends LeagueService {
  constructor(
    protected readonly leagueRepository: LeaguesMongoose,
    protected readonly createUserService: CreateUserService,
    protected readonly getLeagueService: GetLeagueService
  ) {
    super(leagueRepository, createUserService);
  }

  async updateNameLeague(
    id: number,
    league: UpdateLeagueDTO,
    username: string
  ): Promise<any> {
    await this.validateLeague(id);
    await this.getLeagueService.validateAdmLeague(username, id);
    await this.leagueRepository.updateOne(
      {
        id
      },
      { name: league.name }
    );
  }

  async updateAddUserToLeague(
    id: number,
    userIds: number[],
    username: string
  ): Promise<any> {
    await this.validateLeague(id);

    await this.getLeagueService.validateAdmLeague(username, id);

    await this.validateUsers(userIds);

    const league = await this.leagueRepository.getById(id);

    userIds.forEach((userId) => {
      if (league.userIds.indexOf(userId) !== -1)
        throw new CustomErrorException(
          `User '${userId}' already found in league`,
          HttpStatus.NOT_ACCEPTABLE
        );
    });

    await this.leagueRepository.updateAddUser(id, userIds);
  }

  async updateRemoveUserToLeague(
    id: number,
    userIds: number[],
    username: string
  ): Promise<any> {
    await this.validateLeague(id);

    await this.validateUsers(userIds);

    const league = await this.leagueRepository.getById(id);

    userIds.forEach((userId) => {
      if (league.userIds.indexOf(userId) == -1)
        throw new CustomErrorException(
          `User '${userId}' not found in league`,
          HttpStatus.NOT_ACCEPTABLE
        );
    });

    await this.leagueRepository.updateRemoveUser(id, userIds);
  }
}
