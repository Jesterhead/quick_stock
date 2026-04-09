import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { SearchHistory } from './models/search-history.model';

@Injectable()
export class StockService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: any,
  ) {}

  async getStock(symbol: string, userId: string) {
    if (!symbol || symbol.trim().length === 0) {
        throw new BadRequestException('Symbol cannot be empty');
      }
    
      if (symbol.length > 10) {
        throw new BadRequestException('Symbol too long');
      }
    
      if (!/^[A-Z0-9\-\.]+$/i.test(symbol)) {
        throw new BadRequestException('Invalid symbol format');
      }
    
    const apiKey = this.configService.get('FINNHUB_API_KEY');
    const baseUrl = this.configService.get('FINNHUB_BASE_URL');
    
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${baseUrl}/quote`, {
          params: {
            symbol: symbol.toUpperCase(),
            token: apiKey,
          },
        }),
      );
      
      const stockData = {
        symbol: symbol.toUpperCase(),
        price: response.data.c,
        high: response.data.h,
        low: response.data.l,
        open: response.data.o,
        previousClose: response.data.pc,
      };

      await this.addToSearchHistory(userId, stockData.symbol, stockData.price);

      return stockData;
    } catch (error) {
      throw new BadRequestException(`Stock symbol not found: ${symbol}`);
    }
  }

  private async addToSearchHistory(userId: string, symbol: string, price: number) {
    const key = `search-history:${userId}`;
    let history: SearchHistory[] = await this.cacheManager.get(key) || [];

    const newSearch: SearchHistory = {
      symbol,
      price,
      timestamp: new Date(),
    };

    history.unshift(newSearch);
    history = history.slice(0, 5);

    await this.cacheManager.set(key, history, 7 * 24 * 60 * 60 * 1000);
  }

  async getSearchHistory(userId: string): Promise<SearchHistory[]> {
    const key = `search-history:${userId}`;
    
    return (await this.cacheManager.get(key)) || [];
  }
}