import { IsString } from 'class-validator';

export class RequestReportByBrandDto {
  @IsString()
  brand: string;
}
