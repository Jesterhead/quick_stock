import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../entities/auth/user.entity';
import { AuthUtils } from './auth.utils';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let cacheManager: any;
  let userRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('fake-token'),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    cacheManager = module.get(CACHE_MANAGER);
    userRepository = module.get(getRepositoryToken(User));
  });

  describe('login', () => {
    it('should return token and username on successful login', async () => {
      const mockUser = {
        id: 1,
        username: 'brent_seems_nice',
        password: await AuthUtils.hashPassword('hope_this_thing_works'),
      };

      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.login('brent_seems_nice', 'hope_this_thing_works');

      expect(result).toEqual({
        token: 'fake-token',
        username: 'brent_seems_nice',
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 1,
        username: 'brent_seems_nice',
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(
        service.login('nonexistent', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const mockUser = {
        id: 1,
        username: 'brent_seems_nice',
        password: await AuthUtils.hashPassword('correct_password'),
      };

      userRepository.findOne.mockResolvedValue(mockUser);

      await expect(
        service.login('brent_seems_nice', 'wrong_password'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should clear cache for user', async () => {
      const userId = '1';
      await service.logout(userId);

      expect(cacheManager.del).toHaveBeenCalledWith('search-history:1');
    });

    it('should return success message', async () => {
      const result = await service.logout('1');

      expect(result).toEqual({ message: 'Logged out successfully' });
    });
  });
});