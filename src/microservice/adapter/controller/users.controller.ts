import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from 'src/microservice/domain/schemas/users.schema';
import { GetUserService } from 'src/microservice/domain/service/users/get-user.service';
import { UpdateUserService } from 'src/microservice/domain/service/users/update-user.service';
import { UpdateUserDTO, UserDTO } from '../../domain/model/dto/users/user.dto';
import { CreateUserService } from '../../domain/service/users/create-user.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly getUserService: GetUserService,
    private readonly updateUserService: UpdateUserService
  ) {}

  @Post('/create')
  createUser(@Body() user: UserDTO): Promise<any> {
    return this.createUserService.createUser(user);
  }

  @Get('/details/:id')
  getUserById(@Param('id') id: number): Promise<User> {
    return this.getUserService.getUserById(id);
  }

  @Get('/search/:name')
  getUser(@Param('name') name: string): Promise<User[]> {
    return this.getUserService.searchUserByUsername(name);
  }

  @Post('/update/:id')
  updateUserName(
    @Param('id') id: number,
    @Body() user: UpdateUserDTO
  ): Promise<void> {
    return this.updateUserService.updateUserName(id, user);
  }

  @Post('/inactivate/:id')
  inactivateUser(@Param('id') id: number): Promise<void> {
    return this.updateUserService.updateInactivateUser(id);
  }
}
