import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { Injectable } from '@nestjs/common';
import { RoundsMongoose } from '../../adapter/repository/rounds.repository';
import { PushBetDTO } from '../model/dto/push-bet.dto';
import { SetMatchResultDTO } from '../model/dto/set-match-result.dto';
import { Bet } from '../schemas/rounds.schema';
import { CalculateBetsScoreService } from './calculate-bets-score.service';

@Injectable()
export class PushBetService extends AbstractService {
  constructor(
    protected readonly roundsRepository: RoundsMongoose,
    protected readonly calculateBetsService: CalculateBetsScoreService
  ) {
    super();
  }

  pushBet(betDTO: PushBetDTO) {
    this.logger.log(`Pushing bets...`);
    const bet = new Bet();
    bet.idUser = betDTO.idUser;
    bet.scoreHome = betDTO.scoreHome;
    bet.scoreOutside = betDTO.scoreOutside;
    return this.roundsRepository.pushBets(
      betDTO.idCompetition,
      betDTO.edition,
      betDTO.idRound,
      betDTO.idTeamHome,
      betDTO.idTeamOutSide,
      bet
    );
  }

  async setMatchResult(betDTO: SetMatchResultDTO): Promise<void> {
    await this.roundsRepository.updateMatchResult(
      betDTO.idRound,
      betDTO.idTeamHome,
      betDTO.idTeamOutSide,
      betDTO.scoreHome,
      betDTO.scoreOutside
    );

    const betsMatch = this.roundsRepository.getBetsByMatch(
      betDTO.idRound,
      betDTO.idTeamHome,
      betDTO.idTeamOutSide
    );
  }
}
