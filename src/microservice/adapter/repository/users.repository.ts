import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';
import { User, UserDocument } from '../../domain/schemas/users.schema';

@Injectable()
export class UsersMongoose extends MongooseRepository<User, UserDocument> {
  constructor(
    @InjectModel(User.name)
    model: Model<UserDocument>
  ) {
    super(model);
  }

  async getUserById(id: number): Promise<User> {
    const result = await this.model.findOne({ id });
    return result;
  }
}
