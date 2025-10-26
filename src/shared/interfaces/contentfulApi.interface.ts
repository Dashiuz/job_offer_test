import { Document } from 'mongoose';

export interface ContentfulProductsResponse extends Document {
  sys: { type: string };
  total: number;
  skip: number;
  limit: number;
  items: ContentfulProductItem[];
}

export interface ContentfulProductItem extends Document {
  sys: {
    id: string;
    type: string;
    createdAt: Date;
    updatedAt: Date;
    locale: string;
  };
  fields: {
    sku: string;
    name: string;
    brand?: string;
    model?: string;
    category?: string;
    color?: string;
    price?: number;
    currency?: string;
    stock?: number;
  };
}
