import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { BadRequestException, Injectable } from '@nestjs/common';
import { RoundsMongoose } from '../../adapter/repository/rounds.repository';
import { GetBetsDTO } from '../model/dto/get-bets.dto';
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

  async pushBet(betDTO: PushBetDTO) {
    const betsCheck = await this.roundsRepository.getBetsByUserAndMatch(
      betDTO.idUser,
      betDTO.idRound,
      betDTO.idTeamHome,
      betDTO.idTeamOutside
    );

    if (betsCheck.length > 0) {
      throw new BadRequestException(
        'There is already a bet fot this match and user!'
      );
    }

    this.logger.log(`Pushing bets...`);
    const bet = new Bet();
    bet.idUser = betDTO.idUser;
    bet.scoreHome = betDTO.scoreHome;
    bet.scoreOutside = betDTO.scoreOutside;
    bet.scoreBet = null;
    return this.roundsRepository.pushBets(
      betDTO.idCompetition,
      betDTO.edition,
      betDTO.idRound,
      betDTO.idTeamHome,
      betDTO.idTeamOutside,
      bet
    );
  }

  async setMatchResult(betDTO: SetMatchResultDTO): Promise<void> {
    await this.roundsRepository.updateMatchResult(
      betDTO.idRound,
      betDTO.idTeamHome,
      betDTO.idTeamOutside,
      betDTO.scoreHome,
      betDTO.scoreOutside
    );

    const betsMatch = await this.getBetsMyMatch(betDTO);
    console.log('betsMatch');
    console.log(JSON.stringify(betsMatch));
    const arrScore =
      await this.calculateBetsService.calculateScoreByMatchResult(
        betDTO,
        betsMatch
      );
    console.log('arrScore');
    console.log(JSON.stringify(arrScore));
    Object.keys(arrScore).forEach(async (keyUser, index) => {
      await this.roundsRepository.updateScoreResult(
        betDTO.idRound,
        betDTO.idTeamHome,
        betDTO.idTeamOutside,
        Number(keyUser),
        index,
        arrScore[keyUser]
      );
    });
  }

  async getBetsMyMatch(betDTO: GetBetsDTO): Promise<Bet[]> {
    return await this.roundsRepository.getBetsByMatch(
      betDTO.idRound,
      betDTO.idTeamHome,
      betDTO.idTeamOutside
    );
  }
}
