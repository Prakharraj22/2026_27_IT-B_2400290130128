# AI Career Intelligence Platform — Backend API

A production-grade, modular-monolith backend for the AI Career Intelligence Platform built with NestJS, TypeScript, PostgreSQL 15 with pgvector, Prisma ORM, and Redis.

---

## 1. Architectural Overview

The backend is engineered as a clean **modular monolith** with strictly enforced bounded contexts:

```
Clients (Web / Mobile)
        │
        ▼
API Layer / Gateway (/v1/..., Swagger UI at /v1/docs)
  ├── Global JwtAuthGuard (@Public() opt-out)
  ├── Global AppThrottlerGuard (Redis-backed, per-user/IP rate limiting)
  ├── Global GlobalExceptionFilter (standardized error payload, no leaked stack traces)
  ├── Global RequestLogInterceptor (structured JSON, PII/secret scrubbing)
  └── Global TimeoutInterceptor (30s request ceiling)
        │
        ▼
Modular Monolith
  ├── Auth & Profiles (`src/auth/`, `src/profiles/`)
  │     ├── Argon2id password hashing (OWASP 2024 parameters)
  │     ├── JWT access tokens (15m expiry, { sub, role, iat, exp } only)
  │     ├── SHA-256 hashed rotating refresh tokens with family reuse detection
  │     └── Profile CRUD with protected skills ownership and public privacy boundaries
  │
  ├── Job Matching (`src/matching/`)
  │     ├── Semantic search via PostgreSQL pgvector (HNSW index, cosine distance <=>)
  │     ├── Deterministic hybrid ranking: score = (similarity * 0.80) + (skill_overlap * 0.20)
  │     ├── Deterministic match explainability (/v1/matches/:jobId/why, zero LLM calls)
  │     └── Event-driven cache invalidation upon `user.profile.updated`
  │
  ├── Job-Market Intelligence (`src/market-intel/`)
  │     ├── Scheduled ingestion pipeline with idempotent raw storage (ON CONFLICT DO NOTHING)
  │     ├── Scheduled aggregation calculating skill demand trends and salary percentiles (p25, p50, p75)
  │     └── Dashboard APIs (/v1/market/skill-trends, salary-benchmarks, overview)
  │
  └── Shared Infrastructure (`src/shared/`)
        ├── Global PrismaService with multi-schema support (`auth`, `matching`, `market_intel`)
        ├── RedisService with connection resilience and sorted set support
        └── Deterministic MockEmbeddingProvider & MockJobFetcher for local dev & testing
```

---

## 2. Tech Stack

- **Runtime:** Node.js (v20 LTS), TypeScript 5
- **Framework:** NestJS v10
- **Database & Search:** PostgreSQL 15 + pgvector (`pgvector/pgvector:pg15`)
- **ORM:** Prisma 5 (using `multiSchema` preview feature)
- **Cache & Rate Limiting:** Redis 7 (`ioredis`, `@nestjs/throttler`)
- **Authentication:** Passport, JWT, Argon2id
- **Documentation:** OpenAPI 3.0, Swagger UI
- **Testing:** Jest, Supertest, ts-jest
- **Containerization:** Docker, Docker Compose

---

## 3. Getting Started & Local Development

### Prerequisites
- Node.js >= 20.0.0
- npm >= 9.0.0
- Docker & Docker Compose

### 1. Clone & Configure Environment
```bash
cp .env.example .env
```
Review `.env` parameters. Default values are pre-configured for local Docker environments.

### 2. Start PostgreSQL + pgvector and Redis via Docker
```bash
docker compose up -d postgres redis
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Generate Prisma Client & Run Migrations
```bash
npx prisma generate
npx prisma migrate deploy
```

### 5. Seed Synthetic Data
```bash
npm run prisma:seed
```
Seeds 20 synthetic jobs, 10 skill trends, 5 salary benchmarks, and 5 raw postings.

### 6. Start Application
```bash
# Development mode with hot-reload
npm run start:dev

# Production build
npm run build
npm run start:prod
```

API will be running at: `http://localhost:3000`  
OpenAPI / Swagger UI docs: `http://localhost:3000/v1/docs`

---

## 4. Complete API Contract

All endpoints are versioned under `/v1/...`.

### Authentication
- `POST /v1/auth/register` — Register account (`{ email, password }`)
- `POST /v1/auth/login` — Login (`{ email, password }` -> returns accessToken + refreshToken)
- `POST /v1/auth/refresh` — Refresh access token (`{ refreshToken }`)
- `POST /v1/auth/logout` — Revoke refresh token (`{ refreshToken }`, requires Bearer auth)

### User Profiles
- `GET /v1/profiles/me` — Fetch private profile of authenticated user (includes email)
- `PATCH /v1/profiles/me` — Update profile metadata (`fullName`, `headline`, `location`, `yearsExperience`, `preferences`). *Note: updating `skills` is rejected (Resume Module owned).*
- `GET /v1/profiles/:id` — Public profile view (safe: excludes email, password, preferences, embedding)

### Job Matching
- `GET /v1/matches` — Paginated job recommendations with hybrid match scores
- `GET /v1/matches/:jobId/why` — Deterministic explanation of match score and skill breakdown
- `GET /v1/jobs` — Browse/search all job postings with keyword, location, and salary filters
- `GET /v1/jobs/:id` — Detailed view of a single job posting

### Market Intelligence
- `GET /v1/market/skill-trends` — In-demand skill frequencies and average salary ranges
- `GET /v1/market/salary-benchmarks` — Compensation benchmarks (p25, median p50, p75) by role/location
- `GET /v1/market/overview` — Dashboard summary metrics for market health

### System Health
- `GET /v1/health` — Returns status (`ok` or `degraded`), uptime, database and Redis connectivity

---

## 5. Testing Suite

```bash
# Run unit tests
npm test

# Run unit tests with coverage
npm run test:cov

# Run end-to-end integration tests
npm run test:e2e
```

### Testing Capabilities
- **Deterministic Matching Tests:** Validates vector cosine ranking, skill overlap boost calculations, and cache behavior with synthetic embeddings.
- **Market Ingestion Tests:** Validates deduplication idempotency (`ON CONFLICT DO NOTHING`) and aggregation mathematics.
- **Security & Auth Tests:** Verifies password hashing, token rotation, family-level revocation, and rate limiting.

---

## 6. Security Principles

1. **Argon2id for Passwords:** Memory-hard hashing prevents GPU/ASIC brute-force attempts.
2. **Minimal JWT Claims:** Access token payload strictly contains `{ sub, role, iat, exp }`. No PII, email, or sensitive attributes.
3. **Rotating Refresh Tokens:** Single-use refresh tokens stored as SHA-256 hashes. Replay detection revokes the entire family.
4. **No Sensitive Logging:** Structured interceptors strip authorization headers, request bodies, and passwords from logs.
5. **No Direct Cross-Boundary SQL:** Modules interact strictly through defined NestJS service interfaces and domain events.

---

## 7. Known Limitations & Future Roadmap

- **Market Data:** Ingestion currently operates against deterministic synthetic fixtures (`synthetic-mock`). Integrating a live job aggregator (e.g. Adzuna) is achieved by implementing `IJobFetcher`.
- **AI Worker:** Real AI inference is represented by `MockEmbeddingProvider`. Production deployment integrates with the dedicated AI/ML Worker service via the provided interface.
- **Microservices Extraction:** When scaling demands service extraction, each directory (`auth`, `profiles`, `matching`, `market-intel`) is already bounded and can be lifted directly into a standalone service.
