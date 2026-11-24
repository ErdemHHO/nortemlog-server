import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  BASE_ENTITY_COLUMNS,
  DATABASE_COLUMN_TYPES,
} from '../constants/database.constants.js';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    name: BASE_ENTITY_COLUMNS.CREATED_AT,
    type: DATABASE_COLUMN_TYPES.TIMESTAMPTZ,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: BASE_ENTITY_COLUMNS.UPDATED_AT,
    type: DATABASE_COLUMN_TYPES.TIMESTAMPTZ,
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: BASE_ENTITY_COLUMNS.DELETED_AT,
    type: DATABASE_COLUMN_TYPES.TIMESTAMPTZ,
    nullable: true,
  })
  deletedAt: Date | null;
}
