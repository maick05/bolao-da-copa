import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserDTO } from '../../domain/model/dto/users/user.dto';
import { UsersService } from '../../domain/service/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('/create')
  createUser(@Body() user: UserDTO): Promise<any> {
    return this.userService.createUser(user);
  }
}
