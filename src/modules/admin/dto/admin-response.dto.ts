import { ApiProperty } from '@nestjs/swagger';
import { ADMIN_SWAGGER } from '../constants/admin.constant.js';

export class AdminResponseDto {
  @ApiProperty({ description: ADMIN_SWAGGER.ID_DESCRIPTION })
  id: string;

  @ApiProperty({
    description: ADMIN_SWAGGER.EMAIL_DESCRIPTION,
    example: ADMIN_SWAGGER.EMAIL_EXAMPLE,
  })
  email: string;

  @ApiProperty({
    description: ADMIN_SWAGGER.FULL_NAME_DESCRIPTION,
    example: ADMIN_SWAGGER.FULL_NAME_EXAMPLE,
  })
  fullName: string;

  @ApiProperty({ description: ADMIN_SWAGGER.IS_ACTIVE_DESCRIPTION })
  isActive: boolean;

  @ApiProperty({ description: ADMIN_SWAGGER.CREATED_AT_DESCRIPTION })
  createdAt: Date;

  @ApiProperty({ description: ADMIN_SWAGGER.UPDATED_AT_DESCRIPTION })
  updatedAt: Date;

  @ApiProperty({
    description: ADMIN_SWAGGER.DELETED_AT_DESCRIPTION,
    type: Date,
    nullable: true,
  })
  deletedAt: Date | null;
}
