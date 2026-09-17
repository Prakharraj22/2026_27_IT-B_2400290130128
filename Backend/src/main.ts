import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // Trust reverse proxy for accurate IP tracking (critical for rate limiting)
  app.set('trust proxy', 1);

  // Security headers
  app.use(helmet());

  // CORS configuration from environment
  const allowedOrigins = configService.get<string[]>('cors.origins') || ['http://localhost:3001'];
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // URI Versioning: routes become /v1/...
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // OpenAPI 3.0 / Swagger UI setup at /v1/docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('AI Career Intelligence Platform API')
    .setDescription(
      'Modular monolith backend for the AI Career Intelligence Platform.\n\n' +
      'Features:\n' +
      '- Authentication & User Profiles with Argon2id + JWT + rotating refresh tokens\n' +
      '- Job Matching powered by pgvector semantic similarity and deterministic scoring\n' +
      '- Market Intelligence scheduled ingestion and skill/salary aggregation\n\n' +
      '⚠️ Note: Market data and salary figures in development are synthetic and illustrative only.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT access token',
        in: 'header',
      },
      'bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('v1/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = configService.get<number>('port') || 3000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`OpenAPI Documentation: http://localhost:${port}/v1/docs`);
}

bootstrap();
