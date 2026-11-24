import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { AUTH_TOKEN_TYPES } from './constants/auth.constant.js';
import { AuthTokensResponseDto } from './dto/auth-tokens-response.dto.js';

describe('AuthController', () => {
  let controller: AuthController;
  let service: {
    login: ReturnType<typeof vi.fn>;
    refresh: ReturnType<typeof vi.fn>;
  };

  const mockTokenResponse: AuthTokensResponseDto = {
    accessToken: 'access-token-jwt',
    refreshToken: 'refresh-token-jwt',
    tokenType: AUTH_TOKEN_TYPES.BEARER,
    expiresIn: 900,
  };

  beforeEach(async () => {
    service = {
      login: vi.fn().mockResolvedValue(mockTokenResponse),
      refresh: vi.fn().mockResolvedValue(mockTokenResponse),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('delegates login to AuthService', async () => {
    const dto = {
      email: 'admin@northemlog.com',
      password: 'StrongPass123!',
    };

    const result = await controller.login(dto);

    expect(service.login).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockTokenResponse);
  });

  it('delegates refresh to AuthService', async () => {
    const dto = {
      refreshToken: 'refresh-token-jwt',
    };

    const result = await controller.refresh(dto);

    expect(service.refresh).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockTokenResponse);
  });
});
