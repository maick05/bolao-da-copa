import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from '../config/configuration';
import { AuthJwtModule } from './adapter/module/auth-jwt.module';
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
    AuthJwtModule,
    HttpModule,
    TeamsModule,
    BetsModule,
    LeaguesModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
