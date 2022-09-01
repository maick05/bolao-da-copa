import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from 'src/microservice/domain/schemas/users.schema';
import { GetUserService } from 'src/microservice/domain/service/users/get-user.service';
import { UserDTO } from '../../domain/model/dto/users/user.dto';
import { CreateUserService } from '../../domain/service/users/create-user.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly getUserService: GetUserService
  ) {}

  @Post('/create')
  createUser(@Body() user: UserDTO): Promise<any> {
    return this.createUserService.createUser(user);
  }

  @Get('/search/:name')
  getUser(@Param('name') name: string): Promise<User[]> {
    return this.getUserService.searchUserByUsername(name);
  }
}
