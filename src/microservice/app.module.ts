import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from '../config/configuration';
import { BetsModule } from './adapter/module/bets.module';
import { LeaguesModule } from './adapter/module/league.module';
import { TeamsModule } from './adapter/module/teams.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('database.mongodb.connection')
      })
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    HttpModule,
    TeamsModule,
    BetsModule,
    LeaguesModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
