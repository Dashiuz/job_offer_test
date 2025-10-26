import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { ProductsSchema } from '../../shared/schemas/products.schema';

@Module({
  controllers: [ReportsController],
  imports: [
    MongooseModule.forFeature([{ name: 'products', schema: ProductsSchema }]),
  ],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
