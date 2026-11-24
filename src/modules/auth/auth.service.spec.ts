import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { hashPassword } from '../../common/utils/password.util.js';
import { ENV_KEYS } from '../../config/config.constants.js';
import { AdminService } from '../admin/admin.service.js';
import { Admin } from '../admin/entities/admin.entity.js';
import { AuthService } from './auth.service.js';
import { AUTH_TOKEN_TYPES } from './constants/auth.constant.js';

describe('AuthService', () => {
  let service: AuthService;
  let adminService: {
    findByEmailWithPassword: ReturnType<typeof vi.fn>;
    findById: ReturnType<typeof vi.fn>;
  };
  let jwtService: JwtService;
  let hashedPassword: string;

  const mockConfigValues: Record<string, string | number> = {
    [ENV_KEYS.JWT_ACCESS_SECRET]:
      'access_secret_key_for_unit_tests_min_32_chars',
    [ENV_KEYS.JWT_REFRESH_SECRET]:
      'refresh_secret_key_for_unit_tests_min_32_chars',
    [ENV_KEYS.JWT_ACCESS_EXPIRES_IN]: 900,
    [ENV_KEYS.JWT_REFRESH_EXPIRES_IN]: 604800,
  };

  let mockAdmin: Admin;

  beforeEach(async () => {
    hashedPassword = await hashPassword('StrongPass123!');
    mockAdmin = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'admin@northemlog.com',
      fullName: 'Erdem H.',
      password: hashedPassword,
      isActive: true,
      createdAt: new Date('2026-11-23T18:00:00.000Z'),
      updatedAt: new Date('2026-11-23T18:00:00.000Z'),
      deletedAt: null,
    };

    adminService = {
      findByEmailWithPassword: vi.fn().mockResolvedValue(mockAdmin),
      findById: vi.fn().mockResolvedValue(mockAdmin),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: AdminService,
          useValue: adminService,
        },
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn((key: string) => mockConfigValues[key]),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('issues access and refresh tokens with admin payload when credentials are valid', async () => {
      const result = await service.login({
        email: mockAdmin.email,
        password: 'StrongPass123!',
      });

      expect(result.tokenType).toBe(AUTH_TOKEN_TYPES.BEARER);
      expect(result.expiresIn).toBe(900);
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();

      const verifiedAccess = await service.verifyAccessToken(
        result.accessToken,
      );
      expect(verifiedAccess).toEqual({
        id: mockAdmin.id,
        email: mockAdmin.email,
        fullName: mockAdmin.fullName,
        isActive: mockAdmin.isActive,
      });
    });

    it('throws UnauthorizedException when email is not found', async () => {
      adminService.findByEmailWithPassword.mockResolvedValueOnce(null);

      await expect(
        service.login({
          email: 'unknown@northemlog.com',
          password: 'StrongPass123!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when password is wrong', async () => {
      await expect(
        service.login({
          email: mockAdmin.email,
          password: 'WrongPassword!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws ForbiddenException when admin account is inactive', async () => {
      adminService.findByEmailWithPassword.mockResolvedValueOnce({
        id: mockAdmin.id,
        email: mockAdmin.email,
        fullName: mockAdmin.fullName,
        password: mockAdmin.password,
        isActive: false,
        createdAt: mockAdmin.createdAt,
        updatedAt: mockAdmin.updatedAt,
        deletedAt: mockAdmin.deletedAt,
      });

      await expect(
        service.login({
          email: mockAdmin.email,
          password: 'StrongPass123!',
        }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('refresh', () => {
    it('issues a new token pair when refresh token is valid', async () => {
      const initialTokens = await service.login({
        email: mockAdmin.email,
        password: 'StrongPass123!',
      });

      const refreshed = await service.refresh({
        refreshToken: initialTokens.refreshToken,
      });

      expect(refreshed.accessToken).toBeDefined();
      expect(refreshed.refreshToken).toBeDefined();
      expect(refreshed.tokenType).toBe(AUTH_TOKEN_TYPES.BEARER);
    });

    it('throws UnauthorizedException when refresh token is invalid', async () => {
      await expect(
        service.refresh({ refreshToken: 'invalid.token.value' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when an access token type is passed to refresh', async () => {
      const forgedToken = await jwtService.signAsync(
        {
          sub: mockAdmin.id,
          email: mockAdmin.email,
          fullName: mockAdmin.fullName,
          isActive: true,
          type: AUTH_TOKEN_TYPES.ACCESS,
        },
        {
          secret: String(mockConfigValues[ENV_KEYS.JWT_REFRESH_SECRET]),
          expiresIn: 600,
        },
      );

      await expect(
        service.refresh({ refreshToken: forgedToken }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws ForbiddenException when admin becomes inactive before refresh', async () => {
      const initialTokens = await service.login({
        email: mockAdmin.email,
        password: 'StrongPass123!',
      });

      adminService.findById.mockResolvedValueOnce({
        id: mockAdmin.id,
        email: mockAdmin.email,
        fullName: mockAdmin.fullName,
        password: mockAdmin.password,
        isActive: false,
        createdAt: mockAdmin.createdAt,
        updatedAt: mockAdmin.updatedAt,
        deletedAt: mockAdmin.deletedAt,
      });

      await expect(
        service.refresh({ refreshToken: initialTokens.refreshToken }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('verifyAccessToken', () => {
    it('throws UnauthorizedException when token signature is invalid', async () => {
      await expect(
        service.verifyAccessToken('invalid.jwt.token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when admin no longer exists', async () => {
      const tokens = await service.login({
        email: mockAdmin.email,
        password: 'StrongPass123!',
      });
      adminService.findById.mockResolvedValueOnce(null);

      await expect(
        service.verifyAccessToken(tokens.accessToken),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
