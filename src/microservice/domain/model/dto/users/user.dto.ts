import { DTO } from '@devseeder/nestjs-microservices-commons';

export class UserDTO extends DTO {
  name: string;
  username: string;
  password: string;
}
