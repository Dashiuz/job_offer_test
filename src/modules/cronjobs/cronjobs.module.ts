import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { CronjobsService } from './cronjobs.service';
import { CronjobsController } from './cronjobs.controller';
import { ProductsSchema } from '../../shared/schemas/products.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'products', schema: ProductsSchema }]),
    ScheduleModule.forRoot(),
    HttpModule,
  ],
  controllers: [CronjobsController],
  providers: [CronjobsService],
})
export class CronjobsModule {}
