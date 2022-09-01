import { DTO } from '@devseeder/nestjs-microservices-commons';

export class GetBetsClassificationDTO extends DTO {
  idCompetition: number;
  edition: number;
}

export class GetBetsClassificationRoundDTO extends DTO {
  idRound: number;
  idCompetition: number;
  edition: number;
}
