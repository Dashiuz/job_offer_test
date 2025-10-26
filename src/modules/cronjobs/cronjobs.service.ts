import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseBulkWriteResult } from 'mongoose';
import {
  ContentfulProductsResponse,
  ContentfulProductItem,
} from '../../shared/interfaces/contentfulApi.interface';
import { Products } from '../../shared/schemas/products.schema';

@Injectable()
export class CronjobsService {
  spaceId: string;
  environmentId: string;
  accessToken: string;
  contentType: string;

  constructor(
    @InjectModel('products') private productsModel: Model<Products>,
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.spaceId = this.configService.get('contentful.spaceId') || '';
    this.environmentId =
      this.configService.get('contentful.environmentId') || '';
    this.accessToken = this.configService.get('contentful.accessToken') || '';
    this.contentType = this.configService.get('contentful.contentType') || '';
  }

  private readonly logger = new Logger(CronjobsService.name);

  mapContentfulProductsData(data: ContentfulProductItem[]): Products[] {
    return data.map((item) => {
      const product = new Products();

      product.id = item.sys.id;
      product.type = item.sys.type;
      product.createdAt = item.sys.createdAt;
      product.updatedAt = item.sys.updatedAt;
      product.locale = item.sys.locale;

      product.sku = item.fields.sku;
      product.name = item.fields.name;
      product.brand = item.fields.brand;
      product.model = item.fields.model;
      product.category = item.fields.category;
      product.color = item.fields.color;
      product.price = item.fields.price;
      product.currency = item.fields.currency;
      product.stock = item.fields.stock;

      product.isActive = true;

      return product;
    });
  }

  async saveDataToMongoDb(
    data: ContentfulProductItem[],
  ): Promise<MongooseBulkWriteResult | []> {
    this.logger.debug('Saving data to MongoDB...');

    const mappedProducts = this.mapContentfulProductsData(data);

    if (!mappedProducts.length) return [];

    //find inactive products
    const inactiveProducts = await this.productsModel
      .find({ isActive: false })
      .exec();

    //filter out inactive products from mappedProducts
    const filteredMappedProducts = mappedProducts.filter((mp) => {
      return !inactiveProducts.some((ip) => ip.sku === mp.sku);
    });

    const options = filteredMappedProducts.map((p) => ({
      updateOne: { filter: { sku: p.sku }, update: { $set: p }, upsert: true },
    }));

    const result = await this.productsModel.bulkWrite(options, {
      ordered: false,
    });

    this.logger.debug(result);

    return result;
  }

  async fetchContentfulApiData() {
    this.logger.debug('Fetching data from Contentful API...');

    const url = `https://cdn.contentful.com/spaces/${this.spaceId}/environments/${this.environmentId}/entries?access_token=${this.accessToken}&content_type=${this.contentType}`;

    try {
      const response =
        await this.httpService.axiosRef.get<ContentfulProductsResponse>(url);
      const data = response.data;
      this.logger.debug('Data fetched successfully from Contentful API');

      if (data && data.items && data.items.length > 0) {
        await this.saveDataToMongoDb(data.items);
      }

      return data;
    } catch (error) {
      this.logger.error('Error fetching data from Contentful API', error);
      throw error;
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    this.logger.debug('Executing hourly task');
    try {
      await this.fetchContentfulApiData();
    } catch (err) {
      this.logger.error('Error in scheduled fetchContentfulApiData', err);
    }
  }
}
