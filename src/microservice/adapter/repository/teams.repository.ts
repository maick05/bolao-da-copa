import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';
import { Team, TeamDocument } from '../../domain/schemas/teams.schema';

@Injectable()
export class TeamsMongoose extends MongooseRepository<Team, TeamDocument> {
  constructor(
    @InjectModel(Team.name)
    model: Model<TeamDocument>
  ) {
    super(model);
  }

  async getTeamById(id: number): Promise<Team> {
    const result = await this.model.findOne({ id });
    return result;
  }
}
