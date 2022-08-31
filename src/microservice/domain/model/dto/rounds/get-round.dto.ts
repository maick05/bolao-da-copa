import { DTO } from '@devseeder/nestjs-microservices-commons';

export class GetRoundDTO extends DTO {
  idCompetition: number;
  edition: number;
  idRound?: number;
}
