import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientAuthService } from '../../../adapter/repository/client/client-auth.service';
import { UsersMongoose } from '../../../adapter/repository/users.repository';
import { EnumScopes } from '../../enum/enum-scopes.enum';
import { UserAuth } from '../../model/auth/user-auth.model';
import { UserDTO } from '../../model/dto/users/user.dto';
import { User } from '../../schemas/users.schema';

@Injectable()
export class UsersService extends AbstractService {
  constructor(
    protected readonly usersRepository: UsersMongoose,
    protected readonly clientAuthService: ClientAuthService,
    protected readonly configService: ConfigService
  ) {
    super();
  }

  async getUserById(id: number): Promise<User> {
    return this.usersRepository.getUserById(id);
  }

  async createUser(user: UserDTO): Promise<void> {
    const userAuthId = await this.createUserAuth(user);
    await this.createLocalUser(user, userAuthId);
  }

  async createLocalUser(user: UserDTO, userAuthId: string) {
    const userLocal = new User();
    userLocal.id = (await this.usersRepository.getLastId()) + 1;
    userLocal.name = user.name;
    userLocal.username = user.username;
    userLocal.idUserAuth = userAuthId;
    userLocal.active = true;
    await this.usersRepository.insertOne(userLocal, 'User');
  }

  async createUserAuth(user: UserDTO): Promise<string> {
    const userAuth = new UserAuth();
    userAuth.username = user.username;
    userAuth.password = user.password;
    userAuth.projectKey = this.configService.get('doc.projectKey');
    userAuth.scopes = [EnumScopes.USER];

    const response = await this.clientAuthService.createUser(userAuth);
    return response.response.userId;
  }
}
