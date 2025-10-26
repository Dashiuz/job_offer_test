import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiResponse,
  ApiTags,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { DeletedProductsReportDto } from '../../shared/dtos/deletedProductsReport.dto';
import { RequestReportByDateDto } from '../../shared/dtos/requestReportByDate.dto';
import { RequestReportByBrandDto } from '../../shared/dtos/requestReportByBrand.dto';
import { ApiQueryParams } from '../../shared/decorators/queryParamsDecorator';
import { ReportsService } from './reports.service';

@ApiTags('reports')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('deletedProducts')
  @ApiOperation({ summary: 'Get deleted products percentage report' })
  @ApiResponse({
    status: 200,
    description: 'Deleted products report retrieved successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  @ApiNotFoundResponse({ description: "Report couldn't be generated" })
  @ApiInternalServerErrorResponse({
    description: 'Internal server Error, something unexpected happened.',
  })
  async getDeletedProductsReport(): Promise<DeletedProductsReportDto> {
    return this.reportsService.getDeletedProductsReport();
  }

  @Get('activeProductsByDate')
  @ApiOperation({ summary: 'Get active products percentage report by date' })
  @ApiResponse({
    status: 200,
    description: 'Active products report retrieved successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  @ApiNotFoundResponse({ description: "Report couldn't be generated" })
  @ApiInternalServerErrorResponse({
    description: 'Internal server Error, something unexpected happened.',
  })
  @ApiQueryParams([
    {
      name: 'hasPrice',
      required: false,
      type: String,
      format: 'boolean',
      example: 'true',
    },
    {
      name: 'from',
      required: false,
      type: String,
      format: 'date',
      example: '2024-01-01',
    },
    {
      name: 'to',
      required: false,
      type: String,
      format: 'date',
      example: '2024-01-31',
    },
  ])
  async getActiveProductsByDateReport(@Query() query: RequestReportByDateDto) {
    return this.reportsService.getActiveProductsByDateReport(
      query.from,
      query.to,
      query.hasPrice,
    );
  }

  @Get('reportByBrand')
  @ApiOperation({ summary: 'Get active and inactive products report by brand' })
  @ApiResponse({
    status: 200,
    description: 'Report by brand retrieved successfully',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  @ApiNotFoundResponse({ description: "Report couldn't be generated" })
  @ApiInternalServerErrorResponse({
    description: 'Internal server Error, something unexpected happened.',
  })
  @ApiQueryParams([
    { name: 'brand', required: false, type: String, example: 'apple' },
  ])
  async getActiveAndInactiveProductsByBrandReport(
    @Query() query: RequestReportByBrandDto,
  ) {
    return this.reportsService.getActiveAndInactiveProductsByBrandReport(
      query.brand,
    );
  }
}
