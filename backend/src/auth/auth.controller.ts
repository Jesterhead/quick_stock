import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ThrottlerGuard } from '@nestjs/throttler';


@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() credentials: { username: string; password: string }) {
    return this.authService.login(credentials.username, credentials.password);
  }
}