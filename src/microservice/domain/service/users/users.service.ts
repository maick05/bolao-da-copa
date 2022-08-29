import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { Injectable } from '@nestjs/common';
import { UsersMongoose } from '../../../adapter/repository/users.repository';
import { User } from '../../schemas/users.schema';

@Injectable()
export class UsersService extends AbstractService {
  constructor(protected readonly usersRepository: UsersMongoose) {
    super();
  }

  async getUserById(id: number): Promise<User> {
    return this.usersRepository.getUserById(id);
  }
}
