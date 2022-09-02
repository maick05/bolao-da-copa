import { NotFoundException } from '@devseeder/microservices-exceptions';
import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { Injectable, NotAcceptableException } from '@nestjs/common';
import { LeaguesMongoose } from '../../../adapter/repository/leagues.repository';
import { CreateUserService } from '../users/create-user.service';

@Injectable()
export abstract class LeagueService extends AbstractService {
  constructor(
    protected readonly leagueRepository: LeaguesMongoose,
    protected readonly userService: CreateUserService
  ) {
    super();
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

  async validateLeague(id: number): Promise<void> {
    const res = await this.leagueRepository.getById(id);
    if (!res) throw new NotFoundException('League');
  }
}
