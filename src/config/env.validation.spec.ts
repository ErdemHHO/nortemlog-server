import { describe, expect, it } from 'vitest';
import { DEFAULT_CONFIG, NODE_ENVIRONMENTS } from './config.constants.js';
import { validateEnv } from './env.validation.js';

describe('validateEnv', () => {
  it('parses valid environment configuration with defaults', () => {
    const config = validateEnv({
      DB_USER: 'northemlog',
      DB_PASSWORD: 'northemlog_secret',
      DB_NAME: 'northemlog_db',
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
    });
  });

  it('throws when required database variables are missing', () => {
    expect(() => validateEnv({})).toThrow();
  });
});
