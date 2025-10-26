import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Products } from '../../shared/schemas/products.schema';
import { DeletedProductsReportDto } from '../../shared/dtos/deletedProductsReport.dto';
import { BaseProductsDto } from '../../shared/dtos/baseProducts.dto';
import { ActiveProductsReportDto } from '../../shared/dtos/activeProductsReport.dto';
import { ReportByBrandDto } from '../../shared/dtos/reportByBrand.dto';
import { filterInput } from '../../shared/utils/regex.util';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel('products') private readonly productModel: Model<Products>,
  ) {}

  private readonly logger = new Logger(ReportsService.name);

  async getDeletedProductsReport(): Promise<DeletedProductsReportDto> {
    const allProducts = await this.productModel.find().lean().exec();

    //count how many products are active and how many are inactive
    const report = {
      totalProducts: allProducts.length,
      activeProductsAmount: allProducts.filter((p) => p.isActive).length,
      deletedProductsAmount: allProducts.filter((p) => !p.isActive).length,
      deletedProducts: allProducts
        .filter((p) => !p.isActive)
        .map(
          (p): BaseProductsDto => ({
            id: p.id,
            type: p.type,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            locale: p.locale,
            sku: p.sku,
            name: p.name,
            brand: p.brand,
            model: p.model,
            category: p.category,
            color: p.color,
            price: p.price,
            currency: p.currency,
            stock: p.stock,
            isActive: p.isActive,
            deletedAt: p.deletedAt,
          }),
        ),
    };

    const result = {
      totalItems: report.totalProducts,
      totalActive: `${Math.round((report.totalProducts * report.activeProductsAmount) / 100).toFixed(0)}%`,
      totalDeleted: `${Math.round((report.totalProducts * report.deletedProductsAmount) / 100).toFixed(0)}%`,
      deletedProducts: report.deletedProducts,
    };

    this.logger.debug(result);

    return result;
  }

  async getActiveProductsByDateReport(
    from?: Date,
    to?: Date,
    hasPrice?: boolean,
  ): Promise<ActiveProductsReportDto> {
    const filter: FilterQuery<Products> = { isActive: true };

    // date range condition
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = from; // eslint-disable-line @typescript-eslint/no-unsafe-member-access
      if (to) filter.createdAt.$lte = to; // eslint-disable-line @typescript-eslint/no-unsafe-member-access
    }

    // price condition
    if (hasPrice == true) {
      filter.price = { $exists: true, $ne: null, $gte: 0 };
    } else if (hasPrice === false) {
      filter.$or = [
        { price: { $exists: false } },
        { price: null },
        { price: { $lte: 0 } },
      ];
    }

    const totalItems = await this.productModel
      .countDocuments({ isActive: true })
      .exec();
    const queryResult = await this.productModel.find(filter).lean().exec();

    //count how many products are active and how many are inactive
    const report = {
      totalProducts: totalItems,
      activeProductsAmount: queryResult.length,
      activeProducts: queryResult
        .filter((p) => p.isActive)
        .map(
          (p): BaseProductsDto => ({
            id: p.id,
            type: p.type,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            locale: p.locale,
            sku: p.sku,
            name: p.name,
            brand: p.brand,
            model: p.model,
            category: p.category,
            color: p.color,
            price: p.price,
            currency: p.currency,
            stock: p.stock,
            isActive: p.isActive,
            deletedAt: p.deletedAt,
          }),
        ),
    };

    const result: ActiveProductsReportDto = {
      totalItems: report.totalProducts,
      percentageActive: `${Math.round((100 * report.activeProductsAmount) / report.totalProducts).toFixed(0)}%`,
      activeProducts: report.activeProducts,
    };

    this.logger.debug(result);

    return result;
  }

  async getActiveAndInactiveProductsByBrandReport(
    brand: string,
  ): Promise<ReportByBrandDto> {
    const filteredBrand = { $regex: filterInput(brand), $options: 'i' };

    const filter: FilterQuery<Products> = { brand: filteredBrand };

    const products = await this.productModel.find(filter).lean().exec();

    const activeProducts = products.filter((p) => p.isActive);
    const inactiveProducts = products.filter((p) => !p.isActive);

    const result = {
      totalBrandItems: products.length,
      totalActiveBrandItems: activeProducts.length,
      totalInactiveBrandItems: inactiveProducts.length,
      activeBrandProducts: activeProducts,
      inactiveBrandProducts: inactiveProducts,
    };

    this.logger.debug(result);

    return result;
  }
}
