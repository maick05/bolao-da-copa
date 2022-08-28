import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bet, Round, RoundDocument } from '../../domain/schemas/rounds.schema';
import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';

@Injectable()
export class RoundsMongoose extends MongooseRepository<Round, RoundDocument> {
  constructor(
    @InjectModel(Round.name)
    model: Model<RoundDocument>
  ) {
    super(model);
  }

  async pushBets(
    idCompetition: number,
    edition: number,
    idRound: number,
    idTeamHome: number,
    idTeamOutSide: number,
    bet: Bet
  ) {
    bet.dateTime = new Date();
    const res = await this.model.updateOne(
      {
        id: idRound,
        idCompetition,
        edition,
        'matches.idTeamHome': idTeamHome,
        'matches.idTeamOutside': idTeamOutSide
      },
      {
        $push: {
          'matches.$.bets': bet
        }
      },
      {
        strict: false
      }
    );
    console.log(res);
    this.logger.log(`Updated Push Completed!`);
  }

  async updateMatchResult(
    idRound: number,
    idTeamHome: number,
    idTeamOutSide: number,
    scoreHome: number,
    scoreOutside: number
  ) {
    this.updateOne(
      {
        id: idRound,
        'matches.idTeamHome': idTeamHome,
        'matches.idTeamOutSide': idTeamOutSide
      },
      {
        'matches.scoreHome': scoreHome,
        'matches.scoreOutside': scoreOutside
      }
    );
  }

  async getBetsByMatch(
    idRound: number,
    idTeamHome: number,
    idTeamOutSide: number
  ) {
    return this.find(
      {
        id: idRound,
        'matches.idTeamHome': idTeamHome,
        'matches.idTeamOutSide': idTeamOutSide
      },
      {
        'matches.bets': 1
      }
    );
  }
}
