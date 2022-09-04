import { Injectable } from '@nestjs/common';
import { LeaguesMongoose } from '../../../adapter/repository/leagues.repository';
import { GetBetsDTO } from '../../model/dto/bets/get-bets.dto';
import { SetMatchResultDTO } from '../../model/dto/set-match-result.dto';
import { BetRules } from '../../schemas/competitions.schema';
import { Match, Round } from '../../schemas/rounds.schema';
import { PushBetService } from '../bets/push-bet.service';
import { GetLeagueService } from '../leagues/get-league.service';
import { LeagueService } from '../leagues/league.service';
import { GetRoundsByCompetitionService } from '../rounds/get-rounds-by-competition.service';
import { CreateUserService } from '../users/create-user.service';

@Injectable()
export class RecalculationService extends LeagueService {
  constructor(
    protected readonly leagueRepository: LeaguesMongoose,
    protected readonly getLeagueService: GetLeagueService,
    protected readonly getRoundsService: GetRoundsByCompetitionService,
    protected readonly pushBetService: PushBetService,
    protected readonly createUserService: CreateUserService
  ) {
    super(leagueRepository, createUserService);
  }

  async recalculateBetByRule(idLeague: number) {
    const league = await this.getLeagueService.getLeagueById(idLeague);

    const betsDTO = new GetBetsDTO();
    betsDTO.idLeague = league.id;
    betsDTO.idCompetition = league.idCompetition;
    betsDTO.edition = league.edition;

    const rounds = await this.getRoundsService.getRoundsByCompetition(betsDTO);

    rounds.forEach(async (round: Round) => {
      for await (const match of round.matches) {
        betsDTO.idRound = round.id;
        betsDTO.idTeamHome = match.idTeamHome;
        betsDTO.idTeamOutside = match.idTeamOutside;
        await this.recalculateBetByMatch(betsDTO, match);
      }
    });
  }

  async recalculateBetByMatch(betDTO: GetBetsDTO, match: Match) {
    const dto = new SetMatchResultDTO();
    Object.assign(dto, betDTO);
    dto.scoreHome = match.scoreHome;
    dto.scoreOutside = match.scoreOutside;

    await this.pushBetService.setMatchResult(dto);
  }

  async recalculateRulesLeague(
    id: number,
    rules: BetRules,
    username: string
  ): Promise<any> {
    await this.validateLeague(id);
    await this.getLeagueService.validateAdmLeague(username, id);
    await this.leagueRepository.updateRules(id, rules);
    await this.recalculateBetByRule(id);
  }
}
