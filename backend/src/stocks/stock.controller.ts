import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { StockService } from './stock.service';
import { JwtGuard } from '../auth/guards/auth.guard';
import { SearchStockDto } from '../dtos/stocks/search-stock.dto';

@Controller('stock')
@UseGuards(JwtGuard)
export class StockController {
  constructor(private stockService: StockService) {}

  @Get('search')
  searchStock(@Query('symbol') symbol: string, @Req() req) {
    const dto = new SearchStockDto();
    dto.symbol = symbol;
    return this.stockService.getStock(symbol, req.user.userId);
  }

  @Get('history')
  getHistory(@Req() req) {
    return this.stockService.getSearchHistory(req.user.userId);
  }
}