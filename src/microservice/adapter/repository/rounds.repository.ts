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
    idRound: number,
    idTeamHome: number,
    idTeamOutSide: number,
    bet: Bet
  ) {
    bet.dateTime = new Date();
    this.model.updateOne(
      {
        id: idRound,
        'matches.idTeamHome': idTeamHome,
        'matches.idTeamOutSide': idTeamOutSide
      },
      {
        $push: {
          bets: bet
        }
      }
    );
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
