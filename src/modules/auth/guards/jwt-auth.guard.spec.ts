import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from '../auth.service.js';
import {
  AuthenticatedAdmin,
  AuthenticatedRequest,
} from '../interfaces/auth.interface.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let authService: {
    verifyAccessToken: ReturnType<typeof vi.fn>;
  };

  const mockAdmin: AuthenticatedAdmin = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'admin@northemlog.com',
    fullName: 'Erdem H.',
    isActive: true,
  };

  function createMockContext(
    authorizationHeader?: string,
  ): { context: ExecutionContext; request: AuthenticatedRequest } {
    const request = {
      headers: authorizationHeader
        ? { authorization: authorizationHeader }
        : {},
    } as AuthenticatedRequest;

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;

    return { context, request };
  }

  beforeEach(() => {
    authService = {
      verifyAccessToken: vi.fn().mockResolvedValue(mockAdmin),
    };
    guard = new JwtAuthGuard(authService as unknown as AuthService);
  });

  it('attaches authenticated admin to request and returns true when Bearer token is valid', async () => {
    const { context, request } = createMockContext('Bearer valid-jwt-token');

    const canActivate = await guard.canActivate(context);

    expect(canActivate).toBe(true);
    expect(authService.verifyAccessToken).toHaveBeenCalledWith(
      'valid-jwt-token',
    );
    expect(request.admin).toEqual(mockAdmin);
  });

  it('throws UnauthorizedException when Authorization header is missing', async () => {
    const { context } = createMockContext();

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('throws UnauthorizedException when Authorization header is not Bearer', async () => {
    const { context } = createMockContext('Basic dXNlcjpwYXNz');

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
