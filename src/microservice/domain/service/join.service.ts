import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { Injectable } from '@nestjs/common';
import { TeamsMongoose } from '../../adapter/repository/teams.repository';
import { UsersMongoose } from '../../adapter/repository/users.repository';
import { BetResponse, MatchResponse } from '../model/response/match.response';
import { Bet, Match, Round } from '../schemas/rounds.schema';

@Injectable()
export class JoinService extends AbstractService {
  constructor(
    protected readonly teamsRepository: TeamsMongoose,
    protected readonly usersRepository: UsersMongoose
  ) {
    super();
  }

  async joinRounds(rounds: Round[]): Promise<Round[]> {
    const arrRounds = [];
    for await (const round of rounds) {
      round.matches = await this.joinMatchesAndBets(round.matches);
      arrRounds.push(round);
    }
    return arrRounds;
  }

  async joinMatchesAndBets(matches: Match[]) {
    const arrMatches = [];

    if (!matches) return [];

    for await (const match of matches) {
      const matchRes = new MatchResponse();
      Object.assign(matchRes, match);
      arrMatches.push(await this.joinMatch(matchRes));
    }
    return arrMatches;
  }

  async joinMatch(match: MatchResponse) {
    const teamHome = await this.teamsRepository.getTeamById(match.idTeamHome);
    match.teamHome = teamHome.name;
    match.teamHomeCode = teamHome.code;
    match.teamHomeImg = teamHome.image;

    const teamOutside = await this.teamsRepository.getTeamById(
      match.idTeamOutside
    );
    match.teamOutside = teamOutside.name;
    match.teamOutsideCode = teamOutside.code;
    match.teamOutsideImg = teamOutside.image;

    match.bets = await this.joinBets(match.bets);
    return match;
  }

  async joinBets(bets: Bet[]): Promise<BetResponse[]> {
    const arrBet = [];
    if (!bets) return [];
    for await (const bet of bets) {
      const betRes = new BetResponse();
      Object.assign(betRes, bet);
      betRes.user = await this.usersRepository.getInfoTeamById(bet.idUser);
      arrBet.push(betRes);
    }
    return arrBet;
  }
}
