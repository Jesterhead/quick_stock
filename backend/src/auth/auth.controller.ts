import { Controller, Post, Body, UseGuards, Req, ValidationPipe, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtGuard } from './guards/auth.guard';
import { RegisterDto } from '../dtos/auth/register.dto';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body(ValidationPipe) credentials: RegisterDto) {
    return this.authService.login(credentials.username, credentials.password);
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  logout(@Req() req) {
    return this.authService.logout(req.user.userId);
  }

  @Post('register')
  register(@Body(ValidationPipe) registerDto: RegisterDto) {
    return this.authService.register(registerDto.username, registerDto.password);
  }
}