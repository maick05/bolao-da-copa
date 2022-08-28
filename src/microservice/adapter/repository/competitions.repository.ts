import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';
import {
  BetRules,
  Competition,
  CompetitionDocument
} from '../../domain/schemas/competitions.schema';

@Injectable()
export class CompetitionsMongoose extends MongooseRepository<
  Competition,
  CompetitionDocument
> {
  constructor(
    @InjectModel(Competition.name)
    model: Model<CompetitionDocument>
  ) {
    super(model);
  }

  async getRulesCompetition(idCompetition: number): Promise<BetRules> {
    const result = await this.find(
      {
        id: idCompetition
      },
      {
        rules: 1
      }
    );

    return result[0].rules;
  }
}
