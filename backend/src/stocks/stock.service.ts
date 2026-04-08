import { Injectable } from '@nestjs/common';

@Injectable()
export class StockService {
  getStock(symbol: string) {
    // TODO: Call real stock API (Alpha Vantage, IEX, etc.)
    return { symbol: symbol.toUpperCase(), price: 150.25 };
  }
}