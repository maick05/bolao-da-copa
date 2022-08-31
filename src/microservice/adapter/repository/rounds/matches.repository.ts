import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Bet,
  Match,
  Round,
  RoundDocument
} from '../../../domain/schemas/rounds.schema';
import { RoundsMongoose } from './rounds.repository';

@Injectable()
export class MatchesMongoose extends RoundsMongoose {
  constructor(
    @InjectModel(Round.name)
    model: Model<RoundDocument>
  ) {
    super(model);
  }

  async updateMatchResult(
    idRound: number,
    idTeamHome: number,
    idTeamOutside: number,
    scoreHome: number,
    scoreOutside: number
  ) {
    await this.model.updateOne(
      {
        id: idRound,
        'matches.idTeamHome': idTeamHome,
        'matches.idTeamOutside': idTeamOutside
      },
      {
        $set: {
          'matches.$.scoreHome': scoreHome,
          'matches.$.scoreOutside': scoreOutside
        }
      },
      {
        strict: false
      }
    );
  }

  async updateScoreResult(
    idRound: number,
    idTeamHome: number,
    idTeamOutside: number,
    idUser: number,
    index: number,
    scoreBet: number
  ) {
    const updateAttr = `matches.$.bets.${index}.scoreBet`;
    const objSet = {};
    objSet[updateAttr] = scoreBet;
    await this.model.updateOne(
      {
        id: idRound,
        matches: {
          $elemMatch: {
            idTeamHome,
            idTeamOutside,
            bets: {
              $elemMatch: {
                idUser
              }
            }
          }
        }
      },
      {
        $set: objSet
      },
      {
        strict: false
      }
    );
  }
}
