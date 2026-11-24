import { applyDecorators, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AUTH_SWAGGER } from '../constants/auth.constant.js';
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js';

export function AdminAuth(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description: AUTH_SWAGGER.UNAUTHORIZED_DESCRIPTION,
    }),
    ApiForbiddenResponse({
      description: AUTH_SWAGGER.FORBIDDEN_DESCRIPTION,
    }),
  );
}
