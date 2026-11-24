import { ApiProperty } from '@nestjs/swagger';
import { AUTH_SWAGGER } from '../constants/auth.constant.js';

export class AuthTokensResponseDto {
  @ApiProperty({
    description: AUTH_SWAGGER.ACCESS_TOKEN_DESCRIPTION,
    example: AUTH_SWAGGER.ACCESS_TOKEN_EXAMPLE,
  })
  accessToken: string;

  @ApiProperty({
    description: AUTH_SWAGGER.REFRESH_TOKEN_DESCRIPTION,
    example: AUTH_SWAGGER.REFRESH_TOKEN_EXAMPLE,
  })
  refreshToken: string;

  @ApiProperty({
    description: AUTH_SWAGGER.TOKEN_TYPE_DESCRIPTION,
    example: AUTH_SWAGGER.TOKEN_TYPE_EXAMPLE,
  })
  tokenType: string;

  @ApiProperty({
    description: AUTH_SWAGGER.EXPIRES_IN_DESCRIPTION,
    example: AUTH_SWAGGER.EXPIRES_IN_EXAMPLE,
  })
  expiresIn: number;
}
