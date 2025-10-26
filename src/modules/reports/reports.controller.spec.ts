import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

describe('ReportsController', () => {
  let controller: ReportsController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: ReportsService;

  const mockReportsService = {
    getDeletedProductsReport: jest.fn().mockResolvedValue({
      totalItems: 3,
      totalActive: '2',
      totalDeleted: '1',
      deletedProducts: [{ _id: '2', name: 'Deleted Product', isActive: false }],
    }),
    getActiveProductsByDateReport: jest.fn().mockResolvedValue({
      totalItems: 2,
      percentageActive: '100%',
      activeProducts: [{ _id: '1', name: 'Active Product', isActive: true }],
    }),
    getActiveAndInactiveProductsByBrandReport: jest.fn().mockResolvedValue({
      totalBrandItems: 2,
      totalActiveBrandItems: 2,
      totalInactiveBrandItems: 0,
      activeBrandProducts: [
        { _id: '1', name: 'Active Product', isActive: true },
      ],
      inactiveBrandProducts: [],
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: mockReportsService,
        },
      ],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getDeletedProductsReport', () => {
    it('should return deleted products report', async () => {
      const result = await controller.getDeletedProductsReport();
      expect(result.totalDeleted).toBe('1');
      expect(result.deletedProducts[0].isActive).toBe(false);
    });
  });

  describe('getActiveProductsByDateReport', () => {
    it('should return active products report', async () => {
      const result = await controller.getActiveProductsByDateReport({
        from: new Date(),
        to: new Date(),
      });
      expect(result.totalItems).toBe(2);
      expect(result.activeProducts[0].isActive).toBe(true);
    });
  });

  describe('getActiveAndInactiveProductsByBrandReport', () => {
    it('should return report by brand', async () => {
      const result = await controller.getActiveAndInactiveProductsByBrandReport(
        { brand: 'BrandX' },
      );
      expect(result.totalBrandItems).toBe(2);
      expect(result.activeBrandProducts.length).toBeGreaterThanOrEqual(1);
    });
  });
});
