export class PushBetDTO {
  idUser: number;
  idCompetition: number;
  edition: number;
  idRound: number;
  idTeamHome: number;
  idTeamOutside: number;
  scoreHome: number;
  scoreOutside: number;
  penaltWinner?: number;
}
