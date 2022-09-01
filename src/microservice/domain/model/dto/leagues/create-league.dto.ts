import { DTO } from '@devseeder/nestjs-microservices-commons';

export class CreateLeagueDTO extends DTO {
  name: string;
  idCompetition: number;
  edition: number;
  userIds: number[];
}
