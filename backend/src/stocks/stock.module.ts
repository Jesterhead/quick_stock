import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    HttpModule,
    CacheModule.register({
        isGlobal: false,
        ttl: 60 * 60 * 1000,
      }),
  ],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}