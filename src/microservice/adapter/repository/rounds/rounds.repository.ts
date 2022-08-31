import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Bet,
  Match,
  Round,
  RoundDocument
} from '../../../domain/schemas/rounds.schema';
import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';

@Injectable()
export class RoundsMongoose extends MongooseRepository<Round, RoundDocument> {
  constructor(
    @InjectModel(Round.name)
    model: Model<RoundDocument>
  ) {
    super(model);
  }

  async getActualRound(idCompetition: number, edition: number) {
    const response = await this.find(
      {
        idCompetition,
        edition,
        'matches.scoreHome': { $gt: -1 },
        'matches.scoreOutside': { $gt: -1 }
      },
      {
        matches: 1
      },
      {},
      false
    );

    return response;
  }
}
