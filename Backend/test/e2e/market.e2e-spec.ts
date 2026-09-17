import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import * as request from 'supertest';
import { MarketIntelController } from '../../src/market-intel/market-intel.controller';
import { MarketIntelService } from '../../src/market-intel/market-intel.service';

describe('MarketIntelController (e2e)', () => {
  let app: INestApplication;

  const mockMarketIntelService = {
    getSkillTrends: jest.fn().mockResolvedValue({
      data: [
        {
          id: 'trend-1',
          skillName: 'TypeScript',
          demandCount: 520,
          periodStart: '2024-01-01',
          periodEnd: '2024-03-31',
          avgSalaryLow: 120000,
          avgSalaryHigh: 175000,
        },
      ],
      period: { start: '2024-01-01', end: '2024-03-31' },
      dataSource: 'synthetic-mock',
      disclaimer: '⚠️ Synthetic data — illustrative only. NOT real market data.',
    }),
    getSalaryBenchmarks: jest.fn().mockResolvedValue({
      data: [
        {
          id: 'bench-1',
          roleTitle: 'Backend Engineer',
          location: 'global',
          percentile25: 110000,
          percentile50: 140000,
          percentile75: 175000,
          sampleSize: 45,
          period: '2024-Q1',
        },
      ],
      dataSource: 'synthetic-mock',
      disclaimer: '⚠️ Synthetic data — illustrative only. NOT real market data.',
    }),
    getOverview: jest.fn().mockResolvedValue({
      topSkills: [{ skillName: 'TypeScript', demandCount: 520 }],
      headlineSalaryStats: [{ roleTitle: 'Backend Engineer', median: 140000 }],
      postingVolumeTrend: [{ period: '2024-01-01 to 2024-03-31', volume: 520 }],
      generatedAt: '2024-03-31T00:00:00.000Z',
      dataSource: 'synthetic-mock',
      disclaimer: '⚠️ Synthetic data — illustrative only. NOT real market data.',
    }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [MarketIntelController],
      providers: [
        { provide: MarketIntelService, useValue: mockMarketIntelService },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use((req, res, next) => {
      req.user = { id: 'user-1', role: 'user' };
      next();
    });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('GET /v1/market/skill-trends should return skill demand data', async () => {
    const res = await request(app.getHttpServer())
      .get('/v1/market/skill-trends?limit=10')
      .expect(200);

    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].skillName).toBe('TypeScript');
    expect(res.body.dataSource).toBe('synthetic-mock');
  });

  it('GET /v1/market/salary-benchmarks should return salary percentiles', async () => {
    const res = await request(app.getHttpServer())
      .get('/v1/market/salary-benchmarks?roleTitle=Backend')
      .expect(200);

    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].percentile50).toBe(140000);
  });

  it('GET /v1/market/overview should return dashboard overview payload', async () => {
    const res = await request(app.getHttpServer())
      .get('/v1/market/overview')
      .expect(200);

    expect(res.body.topSkills).toHaveLength(1);
    expect(res.body.headlineSalaryStats).toHaveLength(1);
    expect(res.body.disclaimer).toContain('Synthetic data');
  });
});
