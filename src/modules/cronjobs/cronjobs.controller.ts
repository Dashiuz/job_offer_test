import { Controller, Post } from '@nestjs/common';
import {
  ApiResponse,
  ApiTags,
  ApiOperation,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { CronjobsService } from './cronjobs.service';

@ApiTags('Cronjobs')
@Controller('cronjobs')
export class CronjobsController {
  constructor(private readonly cronjobsService: CronjobsService) {}

  @Post('FetchContentfulData')
  @ApiOperation({
    summary: 'Executes the cronjob manually / Fetch data from Contentful API',
  })
  @ApiResponse({
    status: 200,
    description: 'Data fetched successfully from Contentful API',
  })
  @ApiNotFoundResponse({ description: 'Endpoint not found.' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server Error, something unexpected happened.',
  })
  fetchContentfulApiData() {
    return this.cronjobsService.fetchContentfulApiData();
  }
}
