import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../entities/auth/user.entity';
import { AuthSeeding } from './auth.seeding';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/auth.strategy';


@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: configService.get('JWT_EXPIRATION') },
        }),
    }),
    TypeOrmModule.forFeature([User])
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthSeeding, JwtStrategy],
  exports: [AuthSeeding, JwtModule],
})
export class AuthModule {}