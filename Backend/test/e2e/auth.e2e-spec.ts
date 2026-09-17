import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import * as request from 'supertest';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  const mockAuthService = {
    register: jest.fn().mockResolvedValue({
      id: 'mock-user-id',
      email: 'newuser@example.com',
      role: 'user',
      createdAt: new Date(),
    }),
    login: jest.fn().mockResolvedValue({
      accessToken: 'valid_access_token',
      refreshToken: 'valid_refresh_token',
      expiresIn: 900,
    }),
    refresh: jest.fn().mockResolvedValue({
      accessToken: 'new_access_token',
      expiresIn: 900,
    }),
    logout: jest.fn().mockResolvedValue(undefined),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use((req, res, next) => {
      req.user = { id: 'mock-user-id', role: 'user' };
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

  it('POST /v1/auth/register should create user and return 201', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/auth/register')
      .send({ email: 'newuser@example.com', password: 'Password123!' })
      .expect(201);

    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe('newuser@example.com');
  });

  it('POST /v1/auth/register should fail with 400 on invalid email', async () => {
    await request(app.getHttpServer())
      .post('/v1/auth/register')
      .send({ email: 'invalid-email', password: 'Password123!' })
      .expect(400);
  });

  it('POST /v1/auth/login should return access & refresh tokens on success', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send({ email: 'newuser@example.com', password: 'Password123!' })
      .expect(200);

    expect(res.body.accessToken).toBe('valid_access_token');
    expect(res.body.refreshToken).toBe('valid_refresh_token');
  });

  it('POST /v1/auth/refresh should return new access token', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/auth/refresh')
      .send({ refreshToken: 'valid_refresh_token' })
      .expect(200);

    expect(res.body.accessToken).toBe('new_access_token');
  });

  it('POST /v1/auth/logout should return 200 on logout', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/auth/logout')
      .send({ refreshToken: 'valid_refresh_token' })
      .expect(200);

    expect(res.body.message).toBe('Logged out successfully');
  });
});
