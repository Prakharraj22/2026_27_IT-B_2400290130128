import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, VersioningType } from '@nestjs/common';
import * as request from 'supertest';
import { HealthController } from '../../src/api/health/health.controller';
import { PrismaService } from '../../src/shared/database/prisma.service';
import { RedisService } from '../../src/shared/redis/redis.service';

describe('HealthController (e2e)', () => {
  let app: INestApplication;

  const mockPrisma = {
    isHealthy: jest.fn().mockResolvedValue(true),
  };

  const mockRedis = {
    isHealthy: jest.fn().mockResolvedValue(true),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: PrismaService, useValue: mockPrisma },
        { provide: RedisService, useValue: mockRedis },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('GET /v1/health should return ok status and connectivity metrics', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/health')
      .expect(200);

    expect(response.body.status).toBe('ok');
    expect(response.body.db).toBe('ok');
    expect(response.body.redis).toBe('ok');
    expect(typeof response.body.uptime).toBe('number');
  });

  it('GET /v1/health should return degraded status when a dependency is down', async () => {
    mockRedis.isHealthy.mockResolvedValueOnce(false);

    const response = await request(app.getHttpServer())
      .get('/v1/health')
      .expect(200);

    expect(response.body.status).toBe('degraded');
    expect(response.body.redis).toBe('error');
    expect(response.body.db).toBe('ok');
  });
});
