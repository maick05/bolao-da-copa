import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MyJwtAuthGuard } from '../../../core/auth/jwt.auth';
import { EnumScopes } from '../../domain/enum/enum-scopes.enum';
import { User } from '../../domain/schemas/users.schema';
import { GetUserService } from '../../domain/service/users/get-user.service';
import { UpdateUserService } from '../../domain/service/users/update-user.service';
import { UpdateUserDTO, UserDTO } from '../../domain/model/dto/users/user.dto';
import { CreateUserService } from '../../domain/service/users/create-user.service';
import { Scopes } from '@devseeder/nestjs-microservices-core';
import { GetUser } from 'src/microservice/domain/decorators/get-user.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly getUserService: GetUserService,
    private readonly updateUserService: UpdateUserService
  ) {}

  @UseGuards(MyJwtAuthGuard)
  @Scopes(EnumScopes.ADM)
  @Post('/create')
  createUser(@Body() user: UserDTO): Promise<any> {
    return this.createUserService.createUser(user);
  }

  @UseGuards(MyJwtAuthGuard)
  @Scopes(EnumScopes.USER)
  @Get('/details/:id')
  getUserById(@Param('id') id: number): Promise<User> {
    return this.getUserService.getUserById(id);
  }

  @UseGuards(MyJwtAuthGuard)
  @Scopes(EnumScopes.USER)
  @Get('/search/:name')
  getUser(@Param('name') name: string): Promise<User[]> {
    return this.getUserService.searchUserByUsername(name);
  }

  @UseGuards(MyJwtAuthGuard)
  @Scopes(EnumScopes.USER)
  @Post('/update/:id')
  updateUserName(
    @Param('id') id: number,
    @Body() user: UpdateUserDTO,
    @GetUser() username: string
  ): Promise<void> {
    return this.updateUserService.updateUserName(id, user, username);
  }

  @UseGuards(MyJwtAuthGuard)
  @Scopes(EnumScopes.USER)
  @Post('/inactivate/:id')
  inactivateUser(
    @Param('id') id: number,
    @GetUser() username: string
  ): Promise<void> {
    return this.updateUserService.updateInactivateUser(id, username);
  }
}
