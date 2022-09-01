import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException
} from '@nestjs/common';
import { LeaguesMongoose } from 'src/microservice/adapter/repository/leagues.repository';
import { CreateLeagueDTO } from '../../model/dto/leagues/create-league.dto';
import { League } from '../../schemas/leagues.schema';
import { GetRulesService } from '../rules/get-rules.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class CreateLeagueService extends AbstractService {
  constructor(
    protected readonly leagueRepository: LeaguesMongoose,
    private readonly getRulesService: GetRulesService,
    private readonly userService: UsersService
  ) {
    super();
  }

  async createLeague(league: CreateLeagueDTO): Promise<any> {
    await this.validateUsers(league.userIds);

    const newLeague = new League();
    newLeague.id = await this.leagueRepository.getLastId();
    newLeague.name = league.name;
    newLeague.idCompetition = league.idCompetition;
    newLeague.edition = league.edition;
    newLeague.idUserAdm = 1;
    newLeague.userIds = league.userIds;
    newLeague.rules = await this.getRulesService.getRulesByCompetition(
      league.idCompetition
    );
    await this.leagueRepository.insertOne(newLeague, 'League');
  }

  async validateUsers(userIds: number[]): Promise<void> {
    if (userIds.length === 0)
      throw new NotAcceptableException('A league require at least one user!');

    for await (const idUser of userIds) {
      const userRes = await this.userService.getUserById(idUser);
      if (!userRes)
        throw new NotAcceptableException(`User '${idUser}' not found!`);
    }
  }
}
