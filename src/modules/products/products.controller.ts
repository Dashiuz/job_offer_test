import { Controller, Get, Query, Post, Param } from '@nestjs/common';
import {
  ApiResponse,
  ApiTags,
  ApiOperation,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { ApiQueryParams } from '../../shared/decorators/queryParamsDecorator';
import { GetProductsDto } from '../../shared/dtos/getProducts.dto';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('allProducts')
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'List of products' })
  @ApiNotFoundResponse({ description: 'Products not found' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server Error, something unexpected happened.',
  })
  @ApiQueryParams([
    { name: 'page', required: false, type: Number, example: 1 },
    {
      name: 'limit',
      required: false,
      type: Number,
      example: 5,
      description: 'Max 5',
    },
    { name: 'name', required: false, type: String, example: 'iphone' },
    { name: 'category', required: false, type: String, example: 'smartphone' },
    { name: 'brand', required: false, type: String, example: 'apple' },
    { name: 'minPrice', required: false, type: String, example: '500' },
    { name: 'maxPrice', required: false, type: String, example: '1200' },
    {
      name: 'from',
      required: false,
      type: String,
      format: 'date',
      example: '2024-01-01',
    },
    {
      name: 'to',
      required: false,
      type: String,
      format: 'date',
      example: '2024-01-31',
    },
  ])
  async findAll(@Query() query: GetProductsDto) {
    return this.productsService.findAll(query);
  }

  @Post('inactivateProduct/:sku')
  @ApiConsumes('application/json')
  @ApiOperation({ summary: 'Soft delete a product' })
  @ApiResponse({ status: 200, description: 'Product inactivated successfully' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server Error, something unexpected happened.',
  })
  async inactivateProduct(@Param('sku') sku: string) {
    return this.productsService.inactivateProductsBySku(sku);
  }
}
