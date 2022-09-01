import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateUserService } from '../../domain/service/users/create-user.service';
import { User, UsersSchema } from '../../domain/schemas/users.schema';
import { UsersMongoose } from '../repository/users.repository';
import { ClientAuthService } from '../repository/client/client-auth.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../../config/configuration';
import { HttpModule } from '@nestjs/axios';
import { UsersController } from '../controller/users.controller';
import { GetUserService } from 'src/microservice/domain/service/users/get-user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UsersSchema }]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    HttpModule
  ],
  controllers: [UsersController],
  providers: [
    UsersMongoose,
    CreateUserService,
    ClientAuthService,
    GetUserService
  ],
  exports: [UsersMongoose, CreateUserService, ClientAuthService]
})
export class UsersModule {}
