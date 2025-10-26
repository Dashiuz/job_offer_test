import { Test, TestingModule } from '@nestjs/testing';
import { CronjobsService } from './cronjobs.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { getModelToken } from '@nestjs/mongoose';

describe('CronjobsService', () => {
  let service: CronjobsService;

  const configMock = {
    get: jest.fn((key: string) => {
      const map: Record<string, string> = {
        CONTENTFUL_SPACE_ID: 'space',
        CONTENTFUL_ENVIRONMENT_ID: 'master',
        CONTENTFUL_ACCESS_TOKEN: 'token',
        CONTENTFUL_CONTENT_TYPE: 'product',
      };
      return map[key];
    }),
  } as unknown as jest.Mocked<ConfigService>;

  const httpMock = {
    get: jest.fn(),
  } as unknown as jest.Mocked<HttpService>;

  const modelMock = {
    bulkWrite: jest.fn(),
    updateOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  };

  type FetchReturn = Awaited<
    ReturnType<CronjobsService['fetchContentfulApiData']>
  >;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CronjobsService,
        { provide: ConfigService, useValue: configMock },
        { provide: HttpService, useValue: httpMock },
        { provide: getModelToken('products'), useValue: modelMock },
      ],
    }).compile();

    service = module.get<CronjobsService>(CronjobsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('handleCron should call fetchContentfulApiData', () => {
    const expectedShape = {
      sys: { type: 'Array' },
      total: 0,
      skip: 0,
      limit: 100,
      items: [] as Array<{
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
      }>,
    } satisfies {
      sys: { type: string };
      total: number;
      skip: number;
      limit: number;
      items: unknown[];
    };

    const expected = expectedShape as unknown as FetchReturn;

    const spy = jest
      .spyOn(service, 'fetchContentfulApiData')
      .mockResolvedValueOnce(expected);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    service.handleCron();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
