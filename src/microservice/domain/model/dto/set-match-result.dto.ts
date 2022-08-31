import { DTO } from '@devseeder/nestjs-microservices-commons';

export class SetMatchResultDTO extends DTO {
  idCompetition: number;
  edition: number;
  idRound: number;
  idTeamHome: number;
  idTeamOutside: number;
  scoreHome: number;
  scoreOutside: number;
}
