import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { of, throwError } from 'rxjs';
import { StockService } from './stock.service';

describe('StockService', () => {
  let service: StockService;
  let httpService: HttpService;
  let configService: ConfigService;
  let cacheManager: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config = {
                FINNHUB_API_KEY: 'test-api-key',
                FINNHUB_BASE_URL: 'https://finnhub.io/api/v1',
              };
              return config[key];
            }),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn().mockResolvedValue([]),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StockService>(StockService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
    cacheManager = module.get(CACHE_MANAGER);
  });

  describe('getStock', () => {
    it('should return stock data', async () => {
      const mockResponse = {
        data: {
          c: 150.5,
          h: 152.0,
          l: 148.0,
          o: 149.0,
          pc: 149.5,
        },
      };

      httpService.get = jest.fn().mockReturnValue(of(mockResponse));

      const result = await service.getStock('AAPL', '1');

      expect(result).toEqual({
        symbol: 'AAPL',
        price: 150.5,
        high: 152.0,
        low: 148.0,
        open: 149.0,
        previousClose: 149.5,
      });
    });

    it('should add search to history cache', async () => {
      const mockResponse = {
        data: {
          c: 150.5,
          h: 152.0,
          l: 148.0,
          o: 149.0,
          pc: 149.5,
        },
      };

      httpService.get = jest.fn().mockReturnValue(of(mockResponse));

      await service.getStock('AAPL', '1');

      expect(cacheManager.set).toHaveBeenCalled();
    });

    it('should throw error if API fails', async () => {
        httpService.get = jest.fn().mockReturnValue(
          throwError(() => new Error('API Error')),
        );
  
        await expect(service.getStock('INVALID', '1')).rejects.toThrow(
            'Stock symbol not found: INVALID',
        );
      });
  });

  describe('getSearchHistory', () => {
    it('should return search history from cache', async () => {
      const mockHistory = [
        { symbol: 'AAPL', price: 150.5, timestamp: new Date() },
      ];

      cacheManager.get.mockResolvedValue(mockHistory);

      const result = await service.getSearchHistory('1');

      expect(result).toEqual(mockHistory);
    });

    it('should return empty array if no history', async () => {
      cacheManager.get.mockResolvedValue(null);

      const result = await service.getSearchHistory('1');

      expect(result).toEqual([]);
    });
  });
});