import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { Injectable } from '@nestjs/common';
import { RoundsMongoose } from '../../adapter/repository/rounds.repository';
import { GetBetsDTO } from '../model/dto/get-bets.dto';

@Injectable()
export class CalculateBetsScoreService extends AbstractService {
  constructor(protected readonly roundsRepository: RoundsMongoose) {
    super();
  }

  getBetsMyMatch(betDTO: GetBetsDTO) {
    return this.roundsRepository.getBetsByMatch(
      betDTO.idRound,
      betDTO.idTeamHome,
      betDTO.idTeamOutSide
    );
  }
}
