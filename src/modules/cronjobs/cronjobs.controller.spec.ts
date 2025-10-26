import { Test, TestingModule } from '@nestjs/testing';
import { CronjobsController } from './cronjobs.controller';
import { CronjobsService } from './cronjobs.service';

describe('CronjobsController', () => {
  let controller: CronjobsController;
  let service: CronjobsService;

  const serviceMock = {
    fetchContentfulApiData: jest.fn(),
  } as unknown as jest.Mocked<CronjobsService>;

  type FetchReturn = Awaited<
    ReturnType<CronjobsService['fetchContentfulApiData']>
  >;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CronjobsController],
      providers: [
        {
          provide: CronjobsService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<CronjobsController>(CronjobsController);
    service = module.get<CronjobsService>(CronjobsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('POST /cronjobs/FetchContentfulData should delegate to service', async () => {
    const expected: FetchReturn = {
      sys: { type: 'Array' },
      total: 1,
      skip: 0,
      limit: 100,
      items: [
        {
          sys: {
            id: 'prod_1',
            type: 'Entry',
            createdAt: new Date('2024-01-01T00:00:00.000Z'),
            updatedAt: new Date('2024-01-02T00:00:00.000Z'),
            locale: 'en-US',
          },
          fields: {
            sku: 'SKU-001',
            name: 'Sample Product',
            brand: 'ACME',
            model: 'X1',
            category: 'gadgets',
            color: 'black',
            price: 199.99,
            currency: 'USD',
            stock: 10,
          },
        },
      ],
    } as FetchReturn;

    const spy = jest
      .spyOn(service, 'fetchContentfulApiData')
      .mockResolvedValue(expected);

    const result = await controller.fetchContentfulApiData();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expected);
  });
});
