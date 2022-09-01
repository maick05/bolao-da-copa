import { DTO } from '@devseeder/nestjs-microservices-commons';

export class GetBetsDTO extends DTO {
  idCompetition: number;
  edition: number;
  idRound: number;
  idTeamHome: number;
  idTeamOutside: number;
  idLeague?: number;
}
