import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {
  AuthenticatedAdmin,
  AuthenticatedRequest,
} from '../interfaces/auth.interface.js';

export const CurrentAdmin = createParamDecorator(
  (
    data: keyof AuthenticatedAdmin | undefined,
    ctx: ExecutionContext,
  ):
    | AuthenticatedAdmin
    | AuthenticatedAdmin[keyof AuthenticatedAdmin]
    | undefined => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const admin = request.admin;

    if (!admin) {
      return undefined;
    }

    return data ? admin[data] : admin;
  },
);
