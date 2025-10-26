import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class BaseProductsDto {
  @IsString()
  id: string;

  @IsString()
  type?: string;

  @IsString()
  createdAt?: Date;

  @IsString()
  updatedAt?: Date;

  @IsString()
  locale?: string;

  @IsString()
  sku: string;

  @IsString()
  name: string;

  @IsString()
  brand?: string;

  @IsString()
  model?: string;

  @IsString()
  category?: string;

  @IsString()
  color?: string;

  @IsNumber()
  price?: number;

  @IsString()
  currency?: string;

  @IsNumber()
  stock?: number;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  deletedAt?: Date;
}
