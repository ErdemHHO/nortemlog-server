import { z } from 'zod';
import { DEFAULT_CONFIG, NODE_ENVIRONMENTS } from './config.constants.js';

const booleanFromString = z
  .union([z.boolean(), z.string()])
  .transform((val) => {
    if (typeof val === 'boolean') {
      return val;
    }
    return val.toLowerCase() === 'true' || val === '1';
  });

export const envValidationSchema = z.object({
  NODE_ENV: z
    .enum([
      NODE_ENVIRONMENTS.DEVELOPMENT,
      NODE_ENVIRONMENTS.PRODUCTION,
      NODE_ENVIRONMENTS.TEST,
    ])
    .default(NODE_ENVIRONMENTS.DEVELOPMENT),
  PORT: z.coerce.number().int().positive().default(DEFAULT_CONFIG.PORT),
  DB_HOST: z.string().min(1).default(DEFAULT_CONFIG.DB_HOST),
  DB_PORT: z.coerce.number().int().positive().default(DEFAULT_CONFIG.DB_PORT),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_NAME: z.string().min(1),
  DB_SYNCHRONIZE: booleanFromString.default(DEFAULT_CONFIG.DB_SYNCHRONIZE),
  DB_LOGGING: booleanFromString.default(DEFAULT_CONFIG.DB_LOGGING),
});

export type EnvConfig = z.infer<typeof envValidationSchema>;

export function validateEnv(config: Record<string, unknown>): EnvConfig {
  return envValidationSchema.parse(config);
}
