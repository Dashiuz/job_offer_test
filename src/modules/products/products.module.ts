import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsSchema } from '../../shared/schemas/products.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'products', schema: ProductsSchema }]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
