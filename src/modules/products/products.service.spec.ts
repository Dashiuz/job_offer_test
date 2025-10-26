import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ProductsService } from './products.service';
import { Products } from '../../shared/schemas/products.schema';
import { Model } from 'mongoose';

describe('ProductsService', () => {
  let service: ProductsService;
  let model: Model<Products>;

  const mockProduct = {
    _id: '1',
    name: 'Test Product',
    category: 'Test Category',
    brand: 'Test Brand',
    price: 100,
    isActive: true,
  };

  const mockProductModel = {
    find: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([mockProduct]),
    countDocuments: jest.fn().mockResolvedValue(1),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken('products'),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    model = module.get<Model<Products>>(getModelToken('products'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      const result = await service.findAll({ page: 1, limit: 5 });
      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toEqual('Test Product');
      expect(result.total).toBe(1);
    });

    it('should call the model with filters', async () => {
      const spy = jest.spyOn(model, 'find');
      await service.findAll({ name: 'Test' });
      expect(spy).toHaveBeenCalled();
    });
  });
});
