import { Injectable } from '@nestjs/common';
import { UsersMongoose } from '../../../adapter/repository/users.repository';
import { UpdateUserDTO, UserDTO } from '../../model/dto/users/user.dto';
import { User } from '../../schemas/users.schema';
import { UsersService } from './user.service';

@Injectable()
export class UpdateUserService extends UsersService {
  constructor(protected readonly usersRepository: UsersMongoose) {
    super(usersRepository);
  }

  async updateUserName(id: number, user: UpdateUserDTO): Promise<void> {
    await this.validateUser(id);
    await this.usersRepository.updateOne(
      {
        id
      },
      { name: user.name }
    );
  }

  async updateInactivateUser(id: number): Promise<void> {
    await this.validateUser(id);
    await this.usersRepository.updateOne(
      {
        id
      },
      { active: false }
    );
  }
}
