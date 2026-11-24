import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../common/constants/error.constants.js';
import { IsSafeString } from '../../../common/validators/is-safe-string.validator.js';
import { ADMIN_CONSTRAINTS } from '../../admin/constants/admin.constant.js';
import { AUTH_SWAGGER } from '../constants/auth.constant.js';

export class LoginDto {
  @ApiProperty({
    description: AUTH_SWAGGER.EMAIL_DESCRIPTION,
    example: AUTH_SWAGGER.EMAIL_EXAMPLE,
    maxLength: ADMIN_CONSTRAINTS.EMAIL_MAX_LENGTH,
  })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.IS_NOT_EMPTY })
  @IsEmail({}, { message: VALIDATION_MESSAGES.IS_EMAIL })
  @MaxLength(ADMIN_CONSTRAINTS.EMAIL_MAX_LENGTH, {
    message: VALIDATION_MESSAGES.MAX_LENGTH,
  })
  @IsSafeString()
  email: string;

  @ApiProperty({
    description: AUTH_SWAGGER.PASSWORD_DESCRIPTION,
    example: AUTH_SWAGGER.PASSWORD_EXAMPLE,
    maxLength: ADMIN_CONSTRAINTS.PASSWORD_MAX_LENGTH,
  })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.IS_NOT_EMPTY })
  @IsString({ message: VALIDATION_MESSAGES.IS_STRING })
  @MaxLength(ADMIN_CONSTRAINTS.PASSWORD_MAX_LENGTH, {
    message: VALIDATION_MESSAGES.MAX_LENGTH,
  })
  password: string;
}
