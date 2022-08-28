import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Bet,
  Match,
  Round,
  RoundDocument
} from '../../domain/schemas/rounds.schema';
import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';

@Injectable()
export class RoundsMongoose extends MongooseRepository<Round, RoundDocument> {
  constructor(
    @InjectModel(Round.name)
    model: Model<RoundDocument>
  ) {
    super(model);
  }

  async getBetsByUserAndMatch(
    idUser: number,
    idRound: number,
    idTeamHome: number,
    idTeamOutside: number
  ) {
    const res = await this.find(
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
        'matches.bets': 1
      },
      {},
      false
    );

    return res;
  }

  async pushBets(
    idCompetition: number,
    edition: number,
    idRound: number,
    idTeamHome: number,
    idTeamOutside: number,
    bet: Bet
  ) {
    bet.dateTime = new Date();
    const res = await this.model.updateOne(
      {
        id: idRound,
        idCompetition,
        edition,
        'matches.idTeamHome': idTeamHome,
        'matches.idTeamOutside': idTeamOutside
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
    this.logger.log(`Update Push Completed!`);
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

  async getBetsByMatch(
    idRound: number,
    idTeamHome: number,
    idTeamOutside: number
  ): Promise<any[]> {
    const res = await this.find(
      {
        id: idRound,
        matches: {
          $elemMatch: {
            idTeamHome,
            idTeamOutside
          }
        }
      },
      { 'matches.$': 1 },
      {},
      false
    );

    return res.map((round: Round) => {
      return round.matches
        .filter((matchFilter) => {
          return matchFilter.bets.length > 0;
        })
        .map((match: Match) => {
          return match.bets;
        });
    })[0][0];
  }

  async getBetsByCompetition(idCompetition: number) {
    const res = await this.find(
      {
        idCompetition,
        matches: {
          $elemMatch: {
            scoreHome: { $ne: null },
            scoreOutside: { $ne: null }
          }
        }
      },
      { 'matches.$': 1 },
      {},
      false
    );

    return res.map((round: Round) => {
      return round.matches
        .filter((matchFilter) => {
          return matchFilter.bets.length > 0;
        })
        .map((match: Match) => {
          return match.bets;
        });
    })[0][0];
  }
}
