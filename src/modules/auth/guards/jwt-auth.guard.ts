import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service.js';
import {
  AUTH_ERROR_MESSAGES,
  AUTH_HEADERS,
} from '../constants/auth.constant.js';
import { AuthenticatedRequest } from '../interfaces/auth.interface.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractBearerToken(request);

    if (!token) {
      throw new UnauthorizedException(AUTH_ERROR_MESSAGES.MISSING_TOKEN);
    }

    request.admin = await this.authService.verifyAccessToken(token);
    return true;
  }

  private extractBearerToken(request: AuthenticatedRequest): string | null {
    const authHeader = request.headers[AUTH_HEADERS.AUTHORIZATION];

    if (
      typeof authHeader !== 'string' ||
      !authHeader.startsWith(AUTH_HEADERS.BEARER_PREFIX)
    ) {
      return null;
    }

    const token = authHeader.slice(AUTH_HEADERS.BEARER_PREFIX.length).trim();
    return token.length > 0 ? token : null;
  }
}
