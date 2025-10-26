import { IsString, IsNumber, IsArray } from 'class-validator';
import { BaseProductsDto } from 'src/shared/dtos/baseProducts.dto';

export class ActiveProductsReportDto {
  @IsNumber()
  totalItems: number;

  @IsString()
  percentageActive: string;

  @IsArray()
  activeProducts: BaseProductsDto[];
}
