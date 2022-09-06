import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Bet,
  Match,
  Round,
  RoundDocument
} from '../../../domain/schemas/rounds.schema';
import { DateHelper } from '../../helper/date.helper';
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
        matches: 1
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

  async updateBet(
    idCompetition: number,
    edition: number,
    idRound: number,
    idTeamHome: number,
    idTeamOutside: number,
    bet: Bet,
    index: number
  ) {
    const updateAttr = `matches.$.bets.${index}`;
    const objSet = {};
    objSet[updateAttr] = bet;

    bet.dateTime = new Date();
    const res = await this.model.updateOne(
      {
        idCompetition,
        edition,
        id: idRound,
        matches: {
          $elemMatch: {
            idTeamHome,
            idTeamOutside,
            bets: {
              $elemMatch: {
                idUser: bet.idUser
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

    return this.filterBetsMatch(res);
  }

  async checkMatchBlockToBet(
    idRound: number,
    idCompetition: number,
    edition: number,
    idTeamHome: number,
    idTeamOutside: number
  ): Promise<any[]> {
    const now = DateHelper.GetDateNow();
    const res = await this.model.findOne(
      {
        id: idRound,
        idCompetition,
        edition,
        matches: {
          $elemMatch: {
            idTeamHome,
            idTeamOutside
          }
        }
      },
      { 'matches.$': 1 }
    );

    if (!res) return [];

    return res?.matches.filter(
      (item) =>
        (item.scoreHome !== null && item.scoreOutside !== null) ||
        new Date(item.date).getTime() <= new Date(now).getTime()
    );
  }

  async getBetsByMatchAndLeague(
    idRound: number,
    idTeamHome: number,
    idTeamOutside: number,
    userIds: number[]
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

    return this.filterBetsMatch(res, userIds);
  }

  filterBetsMatch(res: Round[], userIds: number[] = []) {
    return res.map((round: Round) => {
      return round.matches
        .filter((matchFilter) => {
          return matchFilter.bets.length > 0;
        })
        .map((match: Match) => {
          return userIds.length > 0
            ? match.bets.filter((bet) => userIds.indexOf(bet.idUser) !== -1)
            : match.bets;
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
