import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Team, TeamsSchema } from '../../domain/schemas/teams.schema';
import { TeamsMongoose } from '../repository/teams.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Team.name, schema: TeamsSchema }])
  ],
  controllers: [],
  providers: [TeamsMongoose],
  exports: [TeamsMongoose]
})
export class TeamsModule {}
