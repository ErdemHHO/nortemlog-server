import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { DEFAULT_CONFIG, ENV_KEYS } from './config/config.constants.js';
import { EnvConfig } from './config/env.validation.js';
import { setupSwagger } from './config/swagger.config.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();

  setupSwagger(app);

  const configService = app.get<ConfigService<EnvConfig, true>>(ConfigService);
  const port =
    configService.get(ENV_KEYS.PORT, { infer: true }) ?? DEFAULT_CONFIG.PORT;

  await app.listen(port);
}
await bootstrap();
