export class PushBetDTO {
  idUser: number;
  idRound: number;
  idTeamHome: number;
  idTeamOutSide: number;
  scoreHome: number;
  scoreOutside: number;
  penaltWinner?: number;
}
