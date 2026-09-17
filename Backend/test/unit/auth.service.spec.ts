import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { AuthService } from '../../src/auth/auth.service';
import { AuthRepository } from '../../src/auth/auth.repository';
import { hashToken } from '../../src/shared/utils/hash';

describe('AuthService (Unit Tests)', () => {
  let service: AuthService;
  let repository: jest.Mocked<AuthRepository>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const mockRepo = {
      findUserByEmail: jest.fn(),
      findUserById: jest.fn(),
      createUser: jest.fn(),
      storeRefreshToken: jest.fn(),
      findRefreshToken: jest.fn(),
      revokeRefreshToken: jest.fn(),
      revokeTokenFamily: jest.fn(),
      rotateRefreshToken: jest.fn(),
    };

    const mockJwt = {
      sign: jest.fn().mockReturnValue('mock_jwt_access_token'),
    };

    const mockConfig = {
      get: jest.fn((key: string) => {
        if (key === 'jwt.accessSecret') return 'test_secret_32_characters_minimum_length';
        if (key === 'jwt.refreshExpiresIn') return '7d';
        if (key === 'argon2.memoryCost') return 19456;
        if (key === 'argon2.timeCost') return 2;
        if (key === 'argon2.parallelism') return 1;
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AuthRepository, useValue: mockRepo },
        { provide: JwtService, useValue: mockJwt },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get(AuthRepository);
    jwtService = module.get(JwtService);
  });

  describe('register', () => {
    it('should successfully register a user and return safe payload', async () => {
      repository.findUserByEmail.mockResolvedValue(null);
      repository.createUser.mockResolvedValue({
        id: 'uuid-1',
        email: 'test@example.com',
        passwordHash: 'hashed',
        role: 'user',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.register({
        email: 'test@example.com',
        password: 'Password123!',
      });

      expect(result.id).toBe('uuid-1');
      expect(result.email).toBe('test@example.com');
      expect((result as any).passwordHash).toBeUndefined();
    });

    it('should throw ConflictException if email already exists', async () => {
      repository.findUserByEmail.mockResolvedValue({
        id: 'existing-id',
        email: 'test@example.com',
      } as any);

      await expect(
        service.register({ email: 'test@example.com', password: 'Password123!' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return token pair on valid credentials', async () => {
      const password = 'Password123!';
      const passwordHash = await argon2.hash(password);

      repository.findUserByEmail.mockResolvedValue({
        id: 'uuid-1',
        email: 'test@example.com',
        passwordHash,
        role: 'user',
        isActive: true,
      } as any);

      const result = await service.login({
        email: 'test@example.com',
        password,
      });

      expect(result.accessToken).toBe('mock_jwt_access_token');
      expect(result.refreshToken).toBeDefined();
      expect(result.expiresIn).toBe(900);
      expect(repository.storeRefreshToken).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException on invalid password', async () => {
      const passwordHash = await argon2.hash('CorrectPassword123!');

      repository.findUserByEmail.mockResolvedValue({
        id: 'uuid-1',
        email: 'test@example.com',
        passwordHash,
        role: 'user',
        isActive: true,
      } as any);

      await expect(
        service.login({ email: 'test@example.com', password: 'WrongPassword' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refresh', () => {
    it('should rotate token and issue new access token', async () => {
      const rawToken = 'sample_raw_refresh_token';
      const tokenHash = hashToken(rawToken);

      repository.findRefreshToken.mockResolvedValue({
        id: 'token-id',
        userId: 'uuid-1',
        tokenHash,
        familyId: 'fam-1',
        expiresAt: new Date(Date.now() + 100000),
        revoked: false,
        createdAt: new Date(),
      });

      repository.findUserById.mockResolvedValue({
        id: 'uuid-1',
        role: 'user',
        isActive: true,
      } as any);

      const result = await service.refresh(rawToken);

      expect(result.accessToken).toBe('mock_jwt_access_token');
      expect(result.expiresIn).toBe(900);
      expect(repository.rotateRefreshToken).toHaveBeenCalledTimes(1);
    });

    it('should revoke entire token family on token reuse detection', async () => {
      const rawToken = 'reused_token';
      const tokenHash = hashToken(rawToken);

      repository.findRefreshToken.mockResolvedValue({
        id: 'token-id',
        userId: 'uuid-1',
        tokenHash,
        familyId: 'compromised-family',
        expiresAt: new Date(Date.now() + 100000),
        revoked: true, // Already used/revoked
        createdAt: new Date(),
      });

      await expect(service.refresh(rawToken)).rejects.toThrow(UnauthorizedException);
      expect(repository.revokeTokenFamily).toHaveBeenCalledWith('compromised-family');
    });
  });
});
