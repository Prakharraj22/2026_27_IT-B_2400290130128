import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import * as request from 'supertest';
import { MatchingController } from '../../src/matching/matching.controller';
import { MatchingService } from '../../src/matching/matching.service';
import { JobsRepository } from '../../src/matching/jobs.repository';

describe('MatchingController (e2e)', () => {
  let app: INestApplication;

  const mockMatchingService = {
    getMatches: jest.fn().mockResolvedValue({
      data: [
        {
          job: { id: 'job-1', title: 'Senior Backend Engineer', company: 'TechCorp' },
          finalScore: 0.88,
          matchingSkills: ['TypeScript', 'PostgreSQL'],
          missingSkills: ['Kubernetes'],
        },
      ],
      meta: { page: 1, limit: 20, total: 1, totalPages: 1 },
    }),
    getMatchExplanation: jest.fn().mockResolvedValue({
      jobId: 'job-1',
      similarityScore: 0.85,
      skillOverlapScore: 0.15,
      finalScore: 0.88,
      matchingSkills: ['TypeScript', 'PostgreSQL'],
      missingSkills: ['Kubernetes'],
      totalJobSkills: 3,
      matchedSkillCount: 2,
      explanation: 'Strong match. You possess 2 of 3 key skills required for this position.',
    }),
  };

  const mockJobsRepository = {
    findMany: jest.fn().mockResolvedValue({
      data: [
        { id: 'job-1', title: 'Senior Backend Engineer', company: 'TechCorp' },
      ],
      meta: { page: 1, limit: 20, total: 1, totalPages: 1 },
    }),
    findById: jest.fn().mockImplementation((id: string) => {
      if (id === 'job-1') {
        return Promise.resolve({
          id: 'job-1',
          title: 'Senior Backend Engineer',
          company: 'TechCorp',
          location: 'Remote',
          remote: true,
          skillsRequired: ['TypeScript', 'PostgreSQL', 'Kubernetes'],
        });
      }
      return Promise.resolve(null);
    }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [MatchingController],
      providers: [
        { provide: MatchingService, useValue: mockMatchingService },
        { provide: JobsRepository, useValue: mockJobsRepository },
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

  it('GET /v1/matches should return paginated recommendations with match scores', async () => {
    const res = await request(app.getHttpServer())
      .get('/v1/matches?page=1&limit=10')
      .expect(200);

    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].finalScore).toBe(0.88);
    expect(res.body.data[0].matchingSkills).toContain('TypeScript');
  });

  it('GET /v1/matches/:jobId/why should return deterministic explanation', async () => {
    const res = await request(app.getHttpServer())
      .get('/v1/matches/job-1/why')
      .expect(200);

    expect(res.body.jobId).toBe('job-1');
    expect(res.body.matchedSkillCount).toBe(2);
    expect(res.body.missingSkills).toContain('Kubernetes');
    expect(res.body.explanation).toContain('Strong match');
  });

  it('GET /v1/jobs should return paginated job postings', async () => {
    const res = await request(app.getHttpServer())
      .get('/v1/jobs?search=Backend')
      .expect(200);

    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toBe('Senior Backend Engineer');
  });

  it('GET /v1/jobs/:id should return single job details', async () => {
    const res = await request(app.getHttpServer())
      .get('/v1/jobs/job-1')
      .expect(200);

    expect(res.body.id).toBe('job-1');
    expect(res.body.company).toBe('TechCorp');
  });

  it('GET /v1/jobs/:id should return 404 on non-existent job', async () => {
    await request(app.getHttpServer())
      .get('/v1/jobs/non-existent-id')
      .expect(404);
  });
});
