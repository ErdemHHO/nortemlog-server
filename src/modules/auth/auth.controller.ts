import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import {
  AUTH_ERROR_MESSAGES,
  AUTH_ROUTES,
  AUTH_SWAGGER,
} from './constants/auth.constant.js';
import { AuthTokensResponseDto } from './dto/auth-tokens-response.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';

@ApiTags(AUTH_SWAGGER.TAG)
@Controller(AUTH_ROUTES.BASE)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(AUTH_ROUTES.LOGIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: AUTH_SWAGGER.LOGIN_SUMMARY })
  @ApiOkResponse({ type: AuthTokensResponseDto })
  @ApiUnauthorizedResponse({
    description: AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS,
  })
  @ApiForbiddenResponse({
    description: AUTH_ERROR_MESSAGES.ACCOUNT_INACTIVE,
  })
  login(@Body() loginDto: LoginDto): Promise<AuthTokensResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post(AUTH_ROUTES.REFRESH)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: AUTH_SWAGGER.REFRESH_SUMMARY })
  @ApiOkResponse({ type: AuthTokensResponseDto })
  @ApiUnauthorizedResponse({
    description: AUTH_ERROR_MESSAGES.INVALID_OR_EXPIRED_TOKEN,
  })
  @ApiForbiddenResponse({
    description: AUTH_ERROR_MESSAGES.ACCOUNT_INACTIVE,
  })
  refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthTokensResponseDto> {
    return this.authService.refresh(refreshTokenDto);
  }
}
