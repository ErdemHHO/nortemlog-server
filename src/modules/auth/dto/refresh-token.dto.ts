import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../common/constants/error.constants.js';
import { AUTH_SWAGGER } from '../constants/auth.constant.js';

export class RefreshTokenDto {
  @ApiProperty({
    description: AUTH_SWAGGER.REFRESH_TOKEN_DESCRIPTION,
    example: AUTH_SWAGGER.REFRESH_TOKEN_EXAMPLE,
  })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.IS_NOT_EMPTY })
  @IsString({ message: VALIDATION_MESSAGES.IS_STRING })
  refreshToken: string;
}
