import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BetsMongoose } from '../../../adapter/repository/rounds/bets.repository';
import { MatchesMongoose } from '../../../adapter/repository/rounds/matches.repository';
import { PushBetDTO } from '../../model/dto/bets/push-bet.dto';
import { SetMatchResultDTO } from '../../model/dto/set-match-result.dto';
import { Bet } from '../../schemas/rounds.schema';
import { CalculateBetsScoreService } from './calculate-bets-score.service';
import { GetBetsMatchService } from './get-bets-match.service';

@Injectable()
export class PushBetService extends AbstractService {
  constructor(
    protected readonly betsRepository: BetsMongoose,
    protected readonly matchesRepository: MatchesMongoose,
    protected readonly calculateBetsService: CalculateBetsScoreService,
    protected readonly getBetsMyMatchService: GetBetsMatchService
  ) {
    super();
  }

  async pushBet(betDTO: PushBetDTO) {
    const betsCheck = await this.betsRepository.getBetsByUserAndMatch(
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
    bet.scoreBet = [];
    return this.betsRepository.pushBets(
      betDTO.idCompetition,
      betDTO.edition,
      betDTO.idRound,
      betDTO.idTeamHome,
      betDTO.idTeamOutside,
      bet
    );
  }

  async setMatchResult(betDTO: SetMatchResultDTO): Promise<void> {
    await this.matchesRepository.updateMatchResult(
      betDTO.idRound,
      betDTO.idTeamHome,
      betDTO.idTeamOutside,
      betDTO.scoreHome,
      betDTO.scoreOutside
    );

    const betsMatch = await this.getBetsMyMatchService.getBetsByMatch(betDTO);

    const arrScore =
      await this.calculateBetsService.calculateScoreByMatchResult(
        betDTO,
        betsMatch
      );

    Object.keys(arrScore).forEach(async (keyUser, index) => {
      await this.matchesRepository.updateScoreResult(
        betDTO.idRound,
        betDTO.idTeamHome,
        betDTO.idTeamOutside,
        Number(keyUser),
        index,
        arrScore[keyUser]
      );
    });
  }
}
