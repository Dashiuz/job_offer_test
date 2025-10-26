import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    findAll: jest.fn().mockResolvedValue({
      page: 1,
      perPage: 5,
      total: 1,
      totalPages: 1,
      items: [
        {
          _id: '1',
          name: 'Test Product',
          category: 'Test Category',
          brand: 'Test Brand',
          price: 100,
          isActive: true,
        },
      ],
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get all products', () => {
    it('should return a list of products', async () => {
      const result = await controller.findAll({ page: 1, limit: 5 });
      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toEqual('Test Product');
    });

    it('should call service.findAll with dto', async () => {
      const dto = { page: 1, limit: 5 };
      const spy = jest.spyOn(service, 'findAll');
      await controller.findAll(dto);
      expect(spy).toHaveBeenCalledWith(dto);
    });
  });
});
