import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserDTO } from 'src/microservice/domain/model/dto/users/user.dto';
import { GetRulesService } from 'src/microservice/domain/service/rules/get-rules.service';
import { UsersService } from 'src/microservice/domain/service/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('/create')
  createUser(@Body() user: UserDTO): Promise<any> {
    return this.userService.createUser(user);
  }
}
