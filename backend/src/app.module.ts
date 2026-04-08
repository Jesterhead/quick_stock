import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { StockController } from './stocks/stock.controller';
import { StockService } from './stocks/stock.service';

@Module({
  imports: [],
  controllers: [AppController, AuthController, StockController],
  providers: [AppService, AuthService, StockService],
})
export class AppModule {}