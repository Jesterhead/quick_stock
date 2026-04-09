import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/auth/user.entity';
import { AuthUtils } from './auth.utils';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class AuthService {
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

        const isPasswordValid = await AuthUtils.comparePassword(password, user.password);
        
        if (!isPasswordValid) {
          throw new UnauthorizedException('Invalid credentials');
        }
    
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
    
        // Create new user (TypeORM parameterized queries prevent SQL injection)
        const newUser = this.userRepository.create({
          username,
          password: hashedPassword,
        });
    
        await this.userRepository.save(newUser);
    
        return { message: 'User registered successfully', username };
      }
}