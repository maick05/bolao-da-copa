import { Injectable } from '@nestjs/common';
import { RoundsMongoose } from '../../adapter/repository/rounds.repository';
import { GetBetsDTO } from '../model/dto/get-bets.dto';
import { PushBetDTO } from '../model/dto/push-bet.dto';
import { SetMatchResultDTO } from '../model/dto/set-match-result.dto';
import { Bet } from '../schemas/rounds.schema';

@Injectable()
export class BetsService {
  constructor(protected readonly roundsRepository: RoundsMongoose) {}
  pushBet(betDTO: PushBetDTO) {
    const bet = new Bet();
    bet.idUser = betDTO.idUser;
    bet.scoreHome = betDTO.scoreHome;
    bet.scoreOutside = betDTO.scoreOutside;
    return this.roundsRepository.pushBets(
      betDTO.idRound,
      betDTO.idTeamHome,
      betDTO.idTeamOutSide,
      bet
    );
  }

  getBets(betDTO: GetBetsDTO) {
    return this.roundsRepository.getBetsByMatch(
      betDTO.idRound,
      betDTO.idTeamHome,
      betDTO.idTeamOutSide
    );
  }

  setMatchResult(betDTO: SetMatchResultDTO) {
    return this.roundsRepository.updateMatchResult(
      betDTO.idRound,
      betDTO.idTeamHome,
      betDTO.idTeamOutSide,
      betDTO.scoreHome,
      betDTO.scoreOutside
    );
  }
}
