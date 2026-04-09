import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [HttpModule],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}