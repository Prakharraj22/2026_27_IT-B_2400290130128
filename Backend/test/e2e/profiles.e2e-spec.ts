import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import * as request from 'supertest';
import { ProfilesController } from '../../src/profiles/profiles.controller';
import { ProfilesService } from '../../src/profiles/profiles.service';

describe('ProfilesController (e2e)', () => {
  let app: INestApplication;

  const mockProfilesService = {
    getMyProfile: jest.fn().mockResolvedValue({
      id: 'prof-1',
      userId: 'user-1',
      email: 'user@example.com',
      fullName: 'Alice Smith',
      headline: 'Software Architect',
      skills: ['TypeScript', 'NestJS'],
    }),
    updateProfile: jest.fn().mockImplementation((userId, dto, rawBody) => {
      if ('skills' in rawBody) {
        const { BadRequestException } = require('@nestjs/common');
        throw new BadRequestException({
          code: 'SKILLS_FIELD_PROTECTED',
          message: 'The skills field is managed by the Resume Module and cannot be updated directly.',
        });
      }
      return Promise.resolve({
        id: 'prof-1',
        userId,
        fullName: dto.fullName || 'Alice Smith',
        headline: dto.headline || 'Software Architect',
      });
    }),
    getPublicProfile: jest.fn().mockResolvedValue({
      id: 'prof-1',
      fullName: 'Alice Smith',
      headline: 'Software Architect',
      skills: ['TypeScript', 'NestJS'],
    }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ProfilesController],
      providers: [
        { provide: ProfilesService, useValue: mockProfilesService },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use((req, res, next) => {
      // Mock authenticated user injected by JwtAuthGuard
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

  it('GET /v1/profiles/me should return private profile of logged in user', async () => {
    const res = await request(app.getHttpServer())
      .get('/v1/profiles/me')
      .expect(200);

    expect(res.body.userId).toBe('user-1');
    expect(res.body.email).toBe('user@example.com');
  });

  it('PATCH /v1/profiles/me should update profile metadata', async () => {
    const res = await request(app.getHttpServer())
      .patch('/v1/profiles/me')
      .send({ fullName: 'Alice Johnson' })
      .expect(200);

    expect(res.body.fullName).toBe('Alice Johnson');
  });

  it('PATCH /v1/profiles/me should reject direct skills mutation', async () => {
    const res = await request(app.getHttpServer())
      .patch('/v1/profiles/me')
      .send({ skills: ['DirectSkillInjection'] })
      .expect(400);

    expect(res.body.message).toContain('skills field is managed by the Resume Module');
  });

  it('GET /v1/profiles/:id should return sanitized public profile', async () => {
    const res = await request(app.getHttpServer())
      .get('/v1/profiles/prof-1')
      .expect(200);

    expect(res.body.id).toBe('prof-1');
    expect(res.body.fullName).toBe('Alice Smith');
    expect(res.body.email).toBeUndefined();
  });
});
