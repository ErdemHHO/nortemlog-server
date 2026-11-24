import { Column, Entity } from 'typeorm';
import { DATABASE_COLUMN_TYPES } from '../../../common/constants/database.constants.js';
import { BaseEntity } from '../../../common/database/base.entity.js';
import {
  ADMIN_COLUMNS,
  ADMIN_CONSTRAINTS,
  ADMIN_TABLE_NAME,
} from '../constants/admin.constant.js';

@Entity({ name: ADMIN_TABLE_NAME })
export class Admin extends BaseEntity {
  @Column({
    type: DATABASE_COLUMN_TYPES.VARCHAR,
    length: ADMIN_CONSTRAINTS.EMAIL_MAX_LENGTH,
    unique: true,
  })
  email: string;

  @Column({
    name: ADMIN_COLUMNS.FULL_NAME,
    type: DATABASE_COLUMN_TYPES.VARCHAR,
    length: ADMIN_CONSTRAINTS.FULL_NAME_MAX_LENGTH,
  })
  fullName: string;

  @Column({
    name: ADMIN_COLUMNS.PASSWORD,
    type: DATABASE_COLUMN_TYPES.VARCHAR,
    length: ADMIN_CONSTRAINTS.PASSWORD_HASH_MAX_LENGTH,
    select: false,
  })
  password: string;

  @Column({
    name: ADMIN_COLUMNS.IS_ACTIVE,
    type: DATABASE_COLUMN_TYPES.BOOLEAN,
    default: true,
  })
  isActive: boolean;
}
