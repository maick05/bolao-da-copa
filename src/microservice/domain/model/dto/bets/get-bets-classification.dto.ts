import { DTO } from '@devseeder/nestjs-microservices-commons';

export class GetBetsClassificationDTO extends DTO {
  idCompetition: number;
  edition: number;
}
