import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { GetProductsDto } from '../../shared/dtos/getProducts.dto';
import { Products } from '../../shared/schemas/products.schema';
import { PaginatedResult } from '../../shared/types/apiPagination.type';
import { filterInput } from '../../shared/utils/regex.util';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('products') private readonly productModel: Model<Products>,
  ) { }

  private readonly logger = new Logger(ProductsService.name);

  async findAll(query: GetProductsDto): Promise<PaginatedResult<Products>> {
    const {
      page = 1,
      limit = 5,
      name,
      category,
      brand,
      minPrice,
      maxPrice,
    } = query;

    const perPage = Math.min(Number(limit) || 5, 5);
    const skip = (Number(page) - 1) * perPage;

    const filter: FilterQuery<Products> = { isActive: true };

    if (name) {
      filter.name = { $regex: filterInput(name), $options: 'i' };
    }

    if (category) {
      filter.category = { $regex: filterInput(category), $options: 'i' };
    }

    if (brand) {
      filter.brand = { $regex: filterInput(brand), $options: 'i' };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice); // eslint-disable-line @typescript-eslint/no-unsafe-member-access
      if (maxPrice) filter.price.$lte = Number(maxPrice); // eslint-disable-line @typescript-eslint/no-unsafe-member-access
    }

    const [items, total] = await Promise.all([
      this.productModel.find(filter).skip(skip).limit(perPage).lean().exec(),
      this.productModel.countDocuments(filter),
    ]);

    return {
      page: Number(page),
      perPage,
      total,
      totalPages: Math.max(1, Math.ceil(total / perPage)),
      items,
    };
  }

  async inactivateProductsBySku(sku: string): Promise<Products | null> {
    const inactivation = await this.productModel
      .findOneAndUpdate(
        { sku: { $regex: filterInput(sku), $options: 'i' } },
        { isActive: false, deletedAt: new Date().toISOString() },
        { new: true },
      )
      .exec();

    this.logger.debug(inactivation);

    return inactivation;
  }

  async emptyProductsCollection() {
    const deleted = await this.productModel.deleteMany({}).exec();
    this.logger.debug(deleted);
    return deleted;
  }
}
