import { IsString, IsNumber, IsArray } from 'class-validator';
import { BaseProductsDto } from 'src/shared/dtos/baseProducts.dto';

export class DeletedProductsReportDto {
  @IsNumber()
  totalItems: number;

  @IsString()
  totalActive: string;

  @IsString()
  totalDeleted: string;

  @IsArray()
  deletedProducts: BaseProductsDto[];
}
