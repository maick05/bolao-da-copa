import { Module } from '@nestjs/common';
import { RoundsMongoose } from '../repository/rounds.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Round, RoundsSchema } from '../../domain/schemas/rounds.schema';
import { RoundsController } from '../controller/rounds.controller';
import { GetActualRoundService } from 'src/microservice/domain/service/rounds/get-actual-round.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Round.name, schema: RoundsSchema }])
  ],
  controllers: [RoundsController],
  providers: [RoundsMongoose, GetActualRoundService],
  exports: [RoundsMongoose, GetActualRoundService]
})
export class RoundsModule {}
