export class PushBetDTO {
  idUser: number;
  idCompetition: number;
  edition: number;
  idRound: number;
  idTeamHome: number;
  idTeamOutSide: number;
  scoreHome: number;
  scoreOutside: number;
  penaltWinner?: number;
}
