import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';
import { League, LeagueDocument } from '../../domain/schemas/leagues.schema';

@Injectable()
export class LeaguesMongoose extends MongooseRepository<
  League,
  LeagueDocument
> {
  constructor(
    @InjectModel(League.name)
    model: Model<LeagueDocument>
  ) {
    super(model);
  }

  async getLastId(): Promise<number> {
    const last = await this.model
      .findOne({}, { id: 1 })
      .sort({ id: -1 })
      .limit(1);

    if (!last) return 1;

    return last.id;
  }

  async getById(id: number): Promise<League> {
    const result = await this.model.findOne({ id });
    return result;
  }

  async updateAddUser(id: number, userIds: number[]): Promise<League> {
    const result = await this.model.findOneAndUpdate(
      { id },
      {
        $push: {
          userIds: {
            $each: userIds
          }
        }
      }
    );
    return result;
  }

  async updateRemoveUser(id: number, userIds: number[]): Promise<League> {
    const result = await this.model.findOneAndUpdate(
      { id },
      {
        $pull: { userIds: { $in: userIds } }
      }
    );
    return result;
  }
}
