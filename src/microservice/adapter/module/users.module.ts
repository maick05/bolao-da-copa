import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from '../../domain/service/users/users.service';
import { User, UsersSchema } from '../../domain/schemas/users.schema';
import { UsersMongoose } from '../repository/users.repository';
import { ClientAuthService } from '../repository/client/client-auth.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../../config/configuration';
import { HttpModule } from '@nestjs/axios';
import { UsersController } from '../controller/users.controller';

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
  providers: [UsersMongoose, UsersService, ClientAuthService],
  exports: [UsersMongoose, UsersService, ClientAuthService]
})
export class UsersModule {}
