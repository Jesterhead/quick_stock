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
import { StockModule } from './stocks/stock.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' 
        ? '.env.prod' 
        : '.env',
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 60 * 1000, // 1 hour default
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 5,
      },
    ]),
    TypeOrmModule.forRoot({
      type: process.env.NODE_ENV === 'production' ? 'postgres' : 'sqlite',
      database: process.env.NODE_ENV === 'production' 
        ? process.env.DATABASE_URL 
        : 'db.sqlite',
      entities: [User],
      synchronize: process.env.NODE_ENV === 'development',
      migrations: ['dist/migrations/*.js'],
      migrationsRun: true,
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    StockModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}