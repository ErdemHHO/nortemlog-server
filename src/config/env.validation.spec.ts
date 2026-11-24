import { describe, expect, it } from 'vitest';
import { DEFAULT_CONFIG, NODE_ENVIRONMENTS } from './config.constants.js';
import { validateEnv } from './env.validation.js';

describe('validateEnv', () => {
  const validJwtSecrets = {
    JWT_ACCESS_SECRET: 'test_access_secret_key_with_at_least_32_characters',
    JWT_REFRESH_SECRET: 'test_refresh_secret_key_with_at_least_32_characters',
  };

  it('parses valid environment configuration with defaults', () => {
    const config = validateEnv({
      DB_USER: 'northemlog',
      DB_PASSWORD: 'northemlog_secret',
      DB_NAME: 'northemlog_db',
      ...validJwtSecrets,
    });

    expect(config).toEqual({
      NODE_ENV: NODE_ENVIRONMENTS.DEVELOPMENT,
      PORT: DEFAULT_CONFIG.PORT,
      DB_HOST: DEFAULT_CONFIG.DB_HOST,
      DB_PORT: DEFAULT_CONFIG.DB_PORT,
      DB_USER: 'northemlog',
      DB_PASSWORD: 'northemlog_secret',
      DB_NAME: 'northemlog_db',
      DB_SYNCHRONIZE: DEFAULT_CONFIG.DB_SYNCHRONIZE,
      DB_LOGGING: DEFAULT_CONFIG.DB_LOGGING,
      JWT_ACCESS_SECRET: validJwtSecrets.JWT_ACCESS_SECRET,
      JWT_REFRESH_SECRET: validJwtSecrets.JWT_REFRESH_SECRET,
      JWT_ACCESS_EXPIRES_IN: DEFAULT_CONFIG.JWT_ACCESS_EXPIRES_IN,
      JWT_REFRESH_EXPIRES_IN: DEFAULT_CONFIG.JWT_REFRESH_EXPIRES_IN,
    });
  });

  it('throws when required database or JWT variables are missing', () => {
    expect(() => validateEnv({})).toThrow();
  });

  it('throws when JWT secrets are shorter than minimum length', () => {
    expect(() =>
      validateEnv({
        DB_USER: 'northemlog',
        DB_PASSWORD: 'northemlog_secret',
        DB_NAME: 'northemlog_db',
        JWT_ACCESS_SECRET: 'short',
        JWT_REFRESH_SECRET: 'short',
      }),
    ).toThrow();
  });
});
