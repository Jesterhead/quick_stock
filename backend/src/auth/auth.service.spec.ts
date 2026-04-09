import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
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
            create: jest.fn(),
            save: jest.fn(),
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

    it('should lock account after max failed attempts', async () => {
        const mockUser = {
          id: 1,
          username: 'brent_seems_nice',
          password: await AuthUtils.hashPassword('correct_password'),
          failedLoginAttempts: 4,
          lockedUntil: null,
        };
    
        userRepository.findOne.mockResolvedValue(mockUser);
        userRepository.save.mockResolvedValue({ ...mockUser, failedLoginAttempts: 5, lockedUntil: new Date() });
    
        await expect(
          service.login('brent_seems_nice', 'wrong_password'),
        ).rejects.toThrow('Too many failed attempts');
      });
    
      it('should throw error if account is locked', async () => {
        const futureDate = new Date(Date.now() + 10 * 60 * 1000);
        const mockUser = {
          id: 1,
          username: 'brent_seems_nice',
          password: await AuthUtils.hashPassword('correct_password'),
          failedLoginAttempts: 5,
          lockedUntil: futureDate,
        };
    
        userRepository.findOne.mockResolvedValue(mockUser);
    
        await expect(
          service.login('brent_seems_nice', 'correct_password'),
        ).rejects.toThrow('Account locked');
      });
    
      it('should reset failed attempts on successful login', async () => {
        const mockUser = {
          id: 1,
          username: 'brent_seems_nice',
          password: await AuthUtils.hashPassword('correct_password'),
          failedLoginAttempts: 2,
          lockedUntil: null,
        };
    
        userRepository.findOne.mockResolvedValue(mockUser);
    
        await service.login('brent_seems_nice', 'correct_password');
    
        expect(userRepository.save).toHaveBeenCalledWith(
          expect.objectContaining({
            failedLoginAttempts: 0,
            lockedUntil: null,
          }),
        );
    });
  });

  describe('register', () => {
    it('should create a new user successfully', async () => {
      userRepository.findOne.mockResolvedValue(null);
      const mockNewUser = {
        id: 2,
        username: 'new_user',
        password: 'hashed_password',
      };
      userRepository.create.mockReturnValue(mockNewUser);
      userRepository.save.mockResolvedValue(mockNewUser);

      const result = await service.register('new_user', 'NewPassword123');

      expect(result).toEqual({
        message: 'User registered successfully',
        username: 'new_user',
      });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username: 'new_user' },
      });
      expect(userRepository.create).toHaveBeenCalled();
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if username already exists', async () => {
      const existingUser = {
        id: 1,
        username: 'existing_user',
        password: 'hashed_password',
      };
      userRepository.findOne.mockResolvedValue(existingUser);

      await expect(
        service.register('existing_user', 'NewPassword123'),
      ).rejects.toThrow(ConflictException);
      expect(userRepository.create).not.toHaveBeenCalled();
    });

    it('should hash password before saving', async () => {
      userRepository.findOne.mockResolvedValue(null);
      const mockNewUser = {
        id: 2,
        username: 'new_user',
        password: 'hashed_password',
      };
      userRepository.create.mockReturnValue(mockNewUser);
      userRepository.save.mockResolvedValue(mockNewUser);

      await service.register('new_user', 'NewPassword123');

      expect(userRepository.create).toHaveBeenCalled();
      const createCall = userRepository.create.mock.calls[0][0];
      expect(createCall.username).toBe('new_user');
      expect(createCall.password).toBeDefined();
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