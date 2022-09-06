import {
  CustomErrorException,
  NotFoundException
} from '@devseeder/microservices-exceptions';
import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { HttpStatus, Injectable, NotAcceptableException } from '@nestjs/common';
import { LeaguesMongoose } from '../../../adapter/repository/leagues.repository';
import { League } from '../../schemas/leagues.schema';
import { CreateUserService } from '../users/create-user.service';

@Injectable()
export abstract class LeagueService extends AbstractService {
  constructor(
    protected readonly leagueRepository: LeaguesMongoose,
    protected readonly createUserService: CreateUserService
  ) {
    super();
  }

  async validateUsers(userIds: number[]): Promise<void> {
    if (userIds.length === 0)
      throw new CustomErrorException(
        'A league require at least one user!',
        HttpStatus.NOT_ACCEPTABLE
      );

    for await (const idUser of userIds) {
      const userRes = await this.createUserService.getUserById(idUser);
      if (!userRes)
        throw new CustomErrorException(
          `User '${idUser}' not found!`,
          HttpStatus.NOT_ACCEPTABLE
        );
    }
  }

  async validateLeague(id: number): Promise<League> {
    const res = await this.leagueRepository.getById(id);
    if (!res) throw new NotFoundException('League');

    return res[0];
  }
}
