import { CustomErrorException } from '@devseeder/microservices-exceptions';
import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { HttpStatus, Injectable } from '@nestjs/common';
import { BetsMongoose } from '../../../adapter/repository/rounds/bets.repository';
import { MatchesMongoose } from '../../../adapter/repository/rounds/matches.repository';
import { PushBetDTO } from '../../model/dto/bets/push-bet.dto';
import { SetMatchResultDTO } from '../../model/dto/set-match-result.dto';
import { Bet, Round } from '../../schemas/rounds.schema';
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
    const matchCheck = await this.betsRepository.checkMatchBlockToBet(
      betDTO.idRound,
      betDTO.idCompetition,
      betDTO.edition,
      betDTO.idTeamHome,
      betDTO.idTeamOutside
    );

    if (matchCheck.length > 0) {
      throw new CustomErrorException(
        'Is not possible, bet after the match start!',
        HttpStatus.NOT_ACCEPTABLE,
        406
      );
    }

    console.log(matchCheck.length);

    const betsCheck = await this.betsRepository.getBetsByUserAndMatch(
      betDTO.idUser,
      betDTO.idRound,
      betDTO.idTeamHome,
      betDTO.idTeamOutside
    );

    this.logger.log(`Pushing bets...`);

    const bet = new Bet();
    bet.idUser = betDTO.idUser;
    bet.scoreHome = betDTO.scoreHome;
    bet.scoreOutside = betDTO.scoreOutside;
    bet.scoreBet = [];

    if (betsCheck.length > 0) {
      return this.betsRepository.updateBet(
        betDTO.idCompetition,
        betDTO.edition,
        betDTO.idRound,
        betDTO.idTeamHome,
        betDTO.idTeamOutside,
        bet,
        this.getUpdateIndex(betDTO, betsCheck[0])
      );
    }

    return this.betsRepository.pushBets(
      betDTO.idCompetition,
      betDTO.edition,
      betDTO.idRound,
      betDTO.idTeamHome,
      betDTO.idTeamOutside,
      bet
    );
  }

  getUpdateIndex(betDTO: PushBetDTO, round: Round) {
    const match = round.matches.filter(
      (item) =>
        item.idTeamHome == betDTO.idTeamHome &&
        item.idTeamOutside == betDTO.idTeamOutside
    )[0];

    let index = 0;
    match.bets.forEach((val, key) => {
      if (val.idUser !== betDTO.idUser) return;
      index = key;
    });

    return index;
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
