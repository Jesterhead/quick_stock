import { Controller, Get, Query } from '@nestjs/common';
import { StockService } from './stock.service';

@Controller('stock')
export class StockController {
  constructor(private stockService: StockService) {}

  @Get('search')
  searchStock(@Query('symbol') symbol: string) {
    return this.stockService.getStock(symbol);
  }
}