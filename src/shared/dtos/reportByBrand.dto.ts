import { IsNumber, IsArray } from 'class-validator';
import { BaseProductsDto } from 'src/shared/dtos/baseProducts.dto';

export class ReportByBrandDto {
  @IsNumber()
  totalBrandItems: number;

  @IsNumber()
  totalActiveBrandItems: number;

  @IsNumber()
  totalInactiveBrandItems: number;

  @IsArray()
  activeBrandProducts: BaseProductsDto[];

  @IsArray()
  inactiveBrandProducts: BaseProductsDto[];
}
