import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductsDocument = HydratedDocument<Products>;

@Schema()
export class Products {
  @Prop({ required: true, unique: true, index: true })
  id: string;

  @Prop()
  type?: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  @Prop()
  locale?: string;

  @Prop({ required: true, unique: true, index: true })
  sku: string;

  @Prop({ required: true, index: true })
  name: string;

  @Prop()
  brand?: string;

  @Prop()
  model?: string;

  @Prop()
  category?: string;

  @Prop()
  color?: string;

  @Prop()
  price?: number;

  @Prop()
  currency?: string;

  @Prop()
  stock?: number;

  @Prop({ required: true })
  isActive: boolean;

  @Prop()
  deletedAt?: Date;
}

export const ProductsSchema = SchemaFactory.createForClass(Products);
