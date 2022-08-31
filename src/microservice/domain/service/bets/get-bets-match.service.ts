import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BetsMongoose } from '../../../adapter/repository/rounds/bets.repository';
import { GetBetsDTO } from '../../model/dto/bets/get-bets.dto';
import { Bet } from '../../schemas/rounds.schema';

@Injectable()
export class GetBetsMatchService extends AbstractService {
  constructor(protected readonly betsRepository: BetsMongoose) {
    super();
  }

  async getBetsByMatch(betDTO: GetBetsDTO): Promise<Bet[]> {
    return await this.betsRepository.getBetsByMatch(
      betDTO.idRound,
      betDTO.idTeamHome,
      betDTO.idTeamOutside
    );
  }
}
