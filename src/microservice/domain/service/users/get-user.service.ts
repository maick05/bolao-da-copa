import { Injectable } from '@nestjs/common';
import { UsersMongoose } from '../../../adapter/repository/users.repository';
import { User } from '../../schemas/users.schema';
import { UsersService } from './user.service';

@Injectable()
export class GetUserService extends UsersService {
  constructor(protected readonly usersRepository: UsersMongoose) {
    super(usersRepository);
  }

  async getUserById(id: number): Promise<User> {
    return this.usersRepository.getUserById(id);
  }

  async searchUserByUsername(name: string): Promise<User[]> {
    const regexName = new RegExp(name, 'i');
    return this.usersRepository.find(
      {
        $or: [
          { name: { $regex: regexName } },
          { username: { $regex: regexName } }
        ],
        active: true
      },
      { id: 1, username: 1, name: 1 },
      {},
      false
    );
  }
}
