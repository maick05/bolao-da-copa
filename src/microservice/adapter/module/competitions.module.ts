import { Module } from '@nestjs/common';
import { BetsController } from '../controller/bets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CompetitionsMongoose } from '../repository/competitions.repository';
import {
  Competition,
  CompetitionsSchema
} from '../../domain/schemas/competitions.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Competition.name, schema: CompetitionsSchema }
    ])
  ],
  controllers: [],
  providers: [CompetitionsMongoose],
  exports: [CompetitionsMongoose]
})
export class CompetitionsModule {}
