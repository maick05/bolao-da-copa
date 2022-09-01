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
export class BetsMongoose extends RoundsMongoose {
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

  async getBetsByCompetition(idCompetition: number, edition: number) {
    const res = await this.find(
      {
        idCompetition,
        edition,
        'matches.scoreHome': { $gt: -1 },
        'matches.scoreOutside': { $gt: -1 }
      },
      { matches: 1 },
      {},
      false
    );

    return this.filterRoundBets(res);
  }

  async getBetsByCompetitionAndRound(
    idCompetition: number,
    edition: number,
    idRound: number
  ) {
    const res = await this.find(
      {
        id: idRound,
        idCompetition,
        edition
      },
      { matches: 1 },
      {},
      false
    );

    return this.filterRoundBets(res);
  }

  filterRoundBets(res: Round[]) {
    const arr = [];

    res.forEach((round: Round) => {
      round.matches
        .filter((matchFilter) => {
          return (
            matchFilter.bets.length > 0 &&
            matchFilter.scoreHome > -1 &&
            matchFilter.scoreOutside > -1
          );
        })
        .forEach((match: Match) => {
          arr.push(...match.bets);
        });
    });

    return arr;
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
