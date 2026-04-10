import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/auth/user.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { StockModule } from './stocks/stock.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' 
        ? '.env.prod' 
        : '.env.local',
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
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get('DATABASE_URL');
        
        if (databaseUrl) {
          // Production: Parse DATABASE_URL
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [User],
            synchronize: true,
            migrations: ['dist/migrations/*.js'],
            migrationsRun: true,
            ssl: { rejectUnauthorized: false },
            logging: true,
          };
        } else {
          // Local development: Use individual variables
          return {
            type: 'postgres',
            host: configService.get('DATABASE_HOST'),
            port: parseInt(configService.get('DATABASE_PORT')),
            username: configService.get('DATABASE_USERNAME'),
            password: configService.get('DATABASE_PASSWORD'),
            database: configService.get('DATABASE_DATABASE'),
            entities: [User],
            synchronize: true,
            migrations: ['dist/migrations/*.js'],
            migrationsRun: true,
            ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
            logging: true,
          };
        }
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    StockModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}