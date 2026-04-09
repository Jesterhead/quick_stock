import { Injectable, Inject, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { User } from '../entities/auth/user.entity';
import { AuthUtils } from './auth.utils';

@Injectable()
export class AuthService {
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION_MINUTES = 15;

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: any,
  ) {}

  async login(username: string, password: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const minutesRemaining = Math.ceil(
        (user.lockedUntil.getTime() - new Date().getTime()) / 60000
      );
      throw new UnauthorizedException(
        `Account locked. Try again in ${minutesRemaining} minutes.`
      );
    }

    if (user.lockedUntil && user.lockedUntil <= new Date()) {
      user.failedLoginAttempts = 0;
      user.lockedUntil = null;
      await this.userRepository.save(user);
    }

    const isPasswordValid = await AuthUtils.comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      user.failedLoginAttempts += 1;

      if (user.failedLoginAttempts >= this.MAX_LOGIN_ATTEMPTS) {
        user.lockedUntil = new Date(
          Date.now() + this.LOCKOUT_DURATION_MINUTES * 60 * 1000
        );
        await this.userRepository.save(user);
        throw new UnauthorizedException(
          `Too many failed attempts. Account locked for ${this.LOCKOUT_DURATION_MINUTES} minutes.`
        );
      }

      await this.userRepository.save(user);
      throw new UnauthorizedException('Invalid credentials');
    }

    user.failedLoginAttempts = 0;
    user.lockedUntil = null;
    await this.userRepository.save(user);

    const token = this.jwtService.sign({ sub: user.id, username: user.username });
    return { token, username: user.username };
  }

  async logout(userId: string) {
    const key = `search-history:${userId}`;
    await this.cacheManager.del(key);
    return { message: 'Logged out successfully' };
  }

  async register(username: string, password: string) {
    const existingUser = await this.userRepository.findOne({ where: { username } });
    
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await AuthUtils.hashPassword(password);

    const newUser = this.userRepository.create({
      username,
      password: hashedPassword,
      failedLoginAttempts: 0,
    });

    await this.userRepository.save(newUser);

    return { message: 'User registered successfully', username };
  }
}