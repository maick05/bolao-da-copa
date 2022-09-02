import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompetitionsMongoose } from '../repository/competitions.repository';
import {
  Competition,
  CompetitionsSchema
} from '../../domain/schemas/competitions.schema';
import { CompetitionsController } from '../controller/competitions.controller';
import { GetRulesService } from '../../domain/service/rules/get-rules.service';
import { AuthJwtModule } from './auth-jwt.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Competition.name, schema: CompetitionsSchema }
    ]),
    AuthJwtModule
  ],
  controllers: [CompetitionsController],
  providers: [CompetitionsMongoose, GetRulesService],
  exports: [CompetitionsMongoose, GetRulesService]
})
export class CompetitionsModule {}
