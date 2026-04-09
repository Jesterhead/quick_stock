import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtGuard } from './guards/auth.guard';


@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() credentials: { username: string; password: string }) {
    return this.authService.login(credentials.username, credentials.password);
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  logout(@Req() req) {
    return this.authService.logout(req.user.userId);
  }
}