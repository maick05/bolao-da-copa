import { NestFactory } from '@nestjs/core';
import { AppModule } from './microservice/adapter/module/bets.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3010);
}
bootstrap();
