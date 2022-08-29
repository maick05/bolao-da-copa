import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from '../../domain/service/users/users.service';
import { User, UsersSchema } from '../../domain/schemas/users.schema';
import { UsersMongoose } from '../repository/users.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UsersSchema }])
  ],
  controllers: [],
  providers: [UsersMongoose, UsersService],
  exports: [UsersMongoose, UsersService]
})
export class UsersModule {}
