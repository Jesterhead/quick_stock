import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StockService } from './stock.service';
import { JwtGuard } from '../auth/guards/auth.guard';

@Controller('stock')
@UseGuards(JwtGuard)
export class StockController {
  constructor(private stockService: StockService) {}

  @Get('search')
  searchStock(@Query('symbol') symbol: string) {
    return this.stockService.getStock(symbol);
  }
}