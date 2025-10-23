import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configuration } from './settings/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: configuration[process.env.NODE_ENV || ""] || '.env',
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_NAME}.kgjn9dp.mongodb.net/?retryWrites=true&w=majority&appName=trainingDB1`,
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
