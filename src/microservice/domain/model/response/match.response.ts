import { Bet, Match } from '../../schemas/rounds.schema';

export class MatchResponse extends Match {
  teamHome: string;
  teamHomeCode: string;
  teamHomeImg: string;
  teamOutside: string;
  teamOutsideCode: string;
  teamOutsideImg: string;
}

export class BetResponse extends Bet {
  user: string;
}
