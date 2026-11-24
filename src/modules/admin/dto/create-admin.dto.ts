import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../common/constants/error.constants.js';
import { IsSafeString } from '../../../common/validators/is-safe-string.validator.js';
import {
  ADMIN_CONSTRAINTS,
  ADMIN_SWAGGER,
} from '../constants/admin.constant.js';

export class CreateAdminDto {
  @ApiProperty({
    description: ADMIN_SWAGGER.EMAIL_DESCRIPTION,
    example: ADMIN_SWAGGER.EMAIL_EXAMPLE,
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
    description: ADMIN_SWAGGER.FULL_NAME_DESCRIPTION,
    example: ADMIN_SWAGGER.FULL_NAME_EXAMPLE,
    minLength: ADMIN_CONSTRAINTS.FULL_NAME_MIN_LENGTH,
    maxLength: ADMIN_CONSTRAINTS.FULL_NAME_MAX_LENGTH,
  })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.IS_NOT_EMPTY })
  @IsString({ message: VALIDATION_MESSAGES.IS_STRING })
  @MinLength(ADMIN_CONSTRAINTS.FULL_NAME_MIN_LENGTH, {
    message: VALIDATION_MESSAGES.MIN_LENGTH,
  })
  @MaxLength(ADMIN_CONSTRAINTS.FULL_NAME_MAX_LENGTH, {
    message: VALIDATION_MESSAGES.MAX_LENGTH,
  })
  @IsSafeString()
  fullName: string;
}
