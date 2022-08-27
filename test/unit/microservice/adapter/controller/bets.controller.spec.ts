import { Test, TestingModule } from '@nestjs/testing';
import { BetsController } from '../../../../../src/microservice/adapter/controller/bets.controller';
import { BetsService } from '../../../../../src/microservice/domain/service/bets.service';

describe('AppController', () => {
  let appController: BetsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BetsController],
      providers: [BetsService]
    }).compile();

    appController = app.get<BetsController>(BetsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
