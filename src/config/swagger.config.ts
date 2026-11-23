import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { SWAGGER_CONFIG } from './config.constants.js';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle(SWAGGER_CONFIG.TITLE)
    .setDescription(SWAGGER_CONFIG.DESCRIPTION)
    .setVersion(SWAGGER_CONFIG.VERSION)
    .addBearerAuth()
    .build();

  const documentFactory = (): OpenAPIObject =>
    SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(SWAGGER_CONFIG.DOCS_PATH, app, documentFactory, {
    jsonDocumentUrl: SWAGGER_CONFIG.JSON_DOCS_PATH,
  });
}
