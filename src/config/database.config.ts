import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DATABASE_TYPE, ENV_KEYS } from './config.constants.js';
import { EnvConfig } from './env.validation.js';

export function createTypeOrmOptions(
  configService: ConfigService<EnvConfig, true>,
): TypeOrmModuleOptions {
  return {
    type: DATABASE_TYPE,
    host: configService.get(ENV_KEYS.DB_HOST, { infer: true }),
    port: configService.get(ENV_KEYS.DB_PORT, { infer: true }),
    username: configService.get(ENV_KEYS.DB_USER, { infer: true }),
    password: configService.get(ENV_KEYS.DB_PASSWORD, { infer: true }),
    database: configService.get(ENV_KEYS.DB_NAME, { infer: true }),
    autoLoadEntities: true,
    synchronize: configService.get(ENV_KEYS.DB_SYNCHRONIZE, { infer: true }),
    logging: configService.get(ENV_KEYS.DB_LOGGING, { infer: true }),
  };
}
