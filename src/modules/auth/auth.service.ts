import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { verifyPassword } from '../../common/utils/password.util.js';
import { ENV_KEYS } from '../../config/config.constants.js';
import { EnvConfig } from '../../config/env.validation.js';
import { AdminService } from '../admin/admin.service.js';
import { Admin } from '../admin/entities/admin.entity.js';
import {
  AUTH_ERROR_MESSAGES,
  AUTH_TOKEN_TYPES,
} from './constants/auth.constant.js';
import { AuthTokensResponseDto } from './dto/auth-tokens-response.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import {
  AdminJwtPayload,
  AuthenticatedAdmin,
} from './interfaces/auth.interface.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvConfig, true>,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthTokensResponseDto> {
    const admin = await this.adminService.findByEmailWithPassword(
      loginDto.email,
    );
    const isPasswordValid = await verifyPassword(
      loginDto.password,
      admin?.password,
    );

    if (!isPasswordValid || !admin) {
      throw new UnauthorizedException(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    if (!admin.isActive) {
      throw new ForbiddenException(AUTH_ERROR_MESSAGES.ACCOUNT_INACTIVE);
    }

    return this.generateTokenPair(admin);
  }

  async refresh(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthTokensResponseDto> {
    const refreshSecret = this.configService.get(ENV_KEYS.JWT_REFRESH_SECRET, {
      infer: true,
    });

    let payload: AdminJwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<AdminJwtPayload>(
        refreshTokenDto.refreshToken,
        {
          secret: refreshSecret,
        },
      );
    } catch {
      throw new UnauthorizedException(
        AUTH_ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN,
      );
    }

    if (payload.type !== AUTH_TOKEN_TYPES.REFRESH) {
      throw new UnauthorizedException(AUTH_ERROR_MESSAGES.INVALID_TOKEN_TYPE);
    }

    const admin = await this.adminService.findById(payload.sub);

    if (!admin) {
      throw new UnauthorizedException(
        AUTH_ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN,
      );
    }

    if (!admin.isActive) {
      throw new ForbiddenException(AUTH_ERROR_MESSAGES.ACCOUNT_INACTIVE);
    }

    return this.generateTokenPair(admin);
  }

  async verifyAccessToken(token: string): Promise<AuthenticatedAdmin> {
    const accessSecret = this.configService.get(ENV_KEYS.JWT_ACCESS_SECRET, {
      infer: true,
    });

    let payload: AdminJwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<AdminJwtPayload>(token, {
        secret: accessSecret,
      });
    } catch {
      throw new UnauthorizedException(
        AUTH_ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN,
      );
    }

    if (payload.type !== AUTH_TOKEN_TYPES.ACCESS) {
      throw new UnauthorizedException(AUTH_ERROR_MESSAGES.INVALID_TOKEN_TYPE);
    }

    const admin = await this.adminService.findById(payload.sub);

    if (!admin) {
      throw new UnauthorizedException(
        AUTH_ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN,
      );
    }

    if (!admin.isActive) {
      throw new ForbiddenException(AUTH_ERROR_MESSAGES.ACCOUNT_INACTIVE);
    }

    return {
      id: admin.id,
      email: admin.email,
      fullName: admin.fullName,
      isActive: admin.isActive,
    };
  }

  private async generateTokenPair(
    admin: Admin,
  ): Promise<AuthTokensResponseDto> {
    const accessSecret = this.configService.get(ENV_KEYS.JWT_ACCESS_SECRET, {
      infer: true,
    });
    const refreshSecret = this.configService.get(ENV_KEYS.JWT_REFRESH_SECRET, {
      infer: true,
    });
    const accessExpiresIn = this.configService.get(
      ENV_KEYS.JWT_ACCESS_EXPIRES_IN,
      { infer: true },
    );
    const refreshExpiresIn = this.configService.get(
      ENV_KEYS.JWT_REFRESH_EXPIRES_IN,
      { infer: true },
    );

    const basePayload = {
      sub: admin.id,
      email: admin.email,
      fullName: admin.fullName,
      isActive: admin.isActive,
    };

    const accessPayload: AdminJwtPayload = {
      ...basePayload,
      type: AUTH_TOKEN_TYPES.ACCESS,
    };

    const refreshPayload: AdminJwtPayload = {
      ...basePayload,
      type: AUTH_TOKEN_TYPES.REFRESH,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        secret: accessSecret,
        expiresIn: accessExpiresIn,
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: refreshSecret,
        expiresIn: refreshExpiresIn,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      tokenType: AUTH_TOKEN_TYPES.BEARER,
      expiresIn: accessExpiresIn,
    };
  }
}
