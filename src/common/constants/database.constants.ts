export const BASE_ENTITY_COLUMNS = {
  CREATED_AT: 'created_at',
  UPDATED_AT: 'updated_at',
  DELETED_AT: 'deleted_at',
} as const;

export const DATABASE_COLUMN_TYPES = {
  TIMESTAMPTZ: 'timestamptz',
  VARCHAR: 'varchar',
  BOOLEAN: 'boolean',
} as const;

export const SORT_ORDER = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const;

export const POSTGRES_ERROR_CODES = {
  UNIQUE_VIOLATION: '23505',
  FOREIGN_KEY_VIOLATION: '23503',
} as const;
