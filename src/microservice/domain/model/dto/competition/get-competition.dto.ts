import { DTO } from '@devseeder/nestjs-microservices-commons';

export class GetCompetitionDTO extends DTO {
  idCompetition: number;
  edition: number;
}
