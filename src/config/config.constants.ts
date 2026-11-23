export const ENV_KEYS = {
  NODE_ENV: 'NODE_ENV',
  PORT: 'PORT',
  DB_HOST: 'DB_HOST',
  DB_PORT: 'DB_PORT',
  DB_USER: 'DB_USER',
  DB_PASSWORD: 'DB_PASSWORD',
  DB_NAME: 'DB_NAME',
  DB_SYNCHRONIZE: 'DB_SYNCHRONIZE',
  DB_LOGGING: 'DB_LOGGING',
} as const;

export const NODE_ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
} as const;

export const DEFAULT_CONFIG = {
  PORT: 3000,
  DB_HOST: 'localhost',
  DB_PORT: 5432,
  DB_SYNCHRONIZE: false,
  DB_LOGGING: false,
} as const;

export const DATABASE_TYPE = 'postgres' as const;

export const SWAGGER_CONFIG = {
  TITLE: 'Northemlog API',
  DESCRIPTION: 'Northemlog Server OpenAPI Documentation',
  VERSION: '1.0',
  DOCS_PATH: 'docs',
  JSON_DOCS_PATH: '/docs-json',
} as const;
