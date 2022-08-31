import { DTO } from '@devseeder/nestjs-microservices-commons';

export class PushBetDTO extends DTO {
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
