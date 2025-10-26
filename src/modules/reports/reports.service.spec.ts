import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ReportsService } from './reports.service';

describe('ReportsService', () => {
  let service: ReportsService;

  const mockProducts = [
    {
      _id: '1',
      name: 'Active Product',
      brand: 'BrandX',
      isActive: true,
      createdAt: new Date(),
      price: 200,
    },
    {
      _id: '2',
      name: 'Deleted Product',
      brand: 'BrandY',
      isActive: false,
      createdAt: new Date(),
      price: 150,
    },
    {
      _id: '3',
      name: 'Another Active Product',
      brand: 'BrandX',
      isActive: true,
      createdAt: new Date(),
      price: null,
    },
  ];

  const mockProductModel = {
    find: jest.fn(() => ({
      lean: jest.fn(() => ({
        exec: jest.fn().mockResolvedValue(mockProducts),
      })),
    })),
    countDocuments: jest.fn(() => ({
      exec: jest.fn().mockResolvedValue(mockProducts.length),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getModelToken('products'),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDeletedProductsReport', () => {
    it('should return a report with deleted products', async () => {
      const result = await service.getDeletedProductsReport();
      expect(result.totalItems).toBe(mockProducts.length);
      expect(Array.isArray(result.deletedProducts)).toBe(true);
      expect(result.deletedProducts.some((p) => p.isActive === false)).toBe(
        true,
      );
    });
  });

  describe('getActiveProductsByDateReport', () => {
    it('should return active products in date range', async () => {
      const result = await service.getActiveProductsByDateReport(
        new Date('2020-01-01'),
        new Date('2030-01-01'),
        true,
      );
      expect(result.totalItems).toBe(mockProducts.length);
      expect(Array.isArray(result.activeProducts)).toBe(true);
      expect(result.activeProducts.every((p) => p.isActive === true)).toBe(
        true,
      );
    });
  });

  describe('getActiveAndInactiveProductsByBrandReport', () => {
    it('should return report grouped by brand', async () => {
      const result =
        await service.getActiveAndInactiveProductsByBrandReport('BrandX');
      expect(result.totalBrandItems).toBeGreaterThanOrEqual(1);
      expect(Array.isArray(result.activeBrandProducts)).toBe(true);
      expect(Array.isArray(result.inactiveBrandProducts)).toBe(true);
    });
  });
});
