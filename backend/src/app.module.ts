import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StockController } from './stocks/stock.controller';
import { StockService } from './stocks/stock.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/auth/user.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 5,
      },
    ]),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User],
      synchronize: true,
    }),
    AuthModule
  ],
  controllers: [AppController, StockController],
  providers: [AppService, StockService],
})
export class AppModule {}