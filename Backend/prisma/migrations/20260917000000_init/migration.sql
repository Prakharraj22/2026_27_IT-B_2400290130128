-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Create schemas
CREATE SCHEMA IF NOT EXISTS "auth";
CREATE SCHEMA IF NOT EXISTS "matching";
CREATE SCHEMA IF NOT EXISTS "market_intel";

-- The `vector` type from pgvector is installed into whichever schema is
-- first in search_path at CREATE EXTENSION time (typically `public`), but a
-- DATABASE_URL with `?schema=auth` (used for Prisma's multiSchema feature)
-- makes the migration connection's search_path just `auth`, so unqualified
-- `vector(...)` column definitions below would fail to resolve. Explicitly
-- restoring `public` here fixes that regardless of how the connection was
-- opened, without depending on connection-string options being honored.
SET search_path TO public, auth, matching, market_intel;

-- ─── AUTH SCHEMA ────────────────────────────────────────────────────────────

CREATE TABLE "auth"."users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "auth"."users"("email");

CREATE TABLE "auth"."profiles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "full_name" TEXT,
    "headline" TEXT,
    "location" TEXT,
    "years_experience" INTEGER,
    "skills" JSONB NOT NULL DEFAULT '[]',
    "preferences" JSONB NOT NULL DEFAULT '{}',
    "embedding" vector(1536),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "profiles_user_id_key" ON "auth"."profiles"("user_id");
CREATE INDEX "profiles_user_id_idx" ON "auth"."profiles"("user_id");
CREATE INDEX "profiles_embedding_hnsw_idx" ON "auth"."profiles"
    USING hnsw ("embedding" vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

ALTER TABLE "auth"."profiles"
    ADD CONSTRAINT "profiles_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "auth"."refresh_tokens" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "token_hash" TEXT NOT NULL,
    "family_id" UUID NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "refresh_tokens_token_hash_key" ON "auth"."refresh_tokens"("token_hash");
CREATE INDEX "refresh_tokens_user_id_idx" ON "auth"."refresh_tokens"("user_id");
CREATE INDEX "refresh_tokens_token_hash_idx" ON "auth"."refresh_tokens"("token_hash");
CREATE INDEX "refresh_tokens_family_id_idx" ON "auth"."refresh_tokens"("family_id");

ALTER TABLE "auth"."refresh_tokens"
    ADD CONSTRAINT "refresh_tokens_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- ─── MATCHING SCHEMA ─────────────────────────────────────────────────────────

CREATE TABLE "matching"."jobs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "remote" BOOLEAN NOT NULL DEFAULT false,
    "salary_min" INTEGER,
    "salary_max" INTEGER,
    "skills_required" JSONB NOT NULL DEFAULT '[]',
    "embedding" vector(1536),
    "source" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,
    "posted_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "jobs_source_source_id_key" ON "matching"."jobs"("source", "source_id");
CREATE INDEX "jobs_location_idx" ON "matching"."jobs"("location");
CREATE INDEX "jobs_remote_idx" ON "matching"."jobs"("remote");
CREATE INDEX "jobs_posted_at_idx" ON "matching"."jobs"("posted_at" DESC);
CREATE INDEX "jobs_embedding_hnsw_idx" ON "matching"."jobs"
    USING hnsw ("embedding" vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

CREATE TABLE "matching"."match_cache" (
    "user_id" UUID NOT NULL,
    "job_id" UUID NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "computed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "match_cache_pkey" PRIMARY KEY ("user_id", "job_id")
);

CREATE INDEX "match_cache_user_id_score_idx" ON "matching"."match_cache"("user_id", "score" DESC);

ALTER TABLE "matching"."match_cache"
    ADD CONSTRAINT "match_cache_job_id_fkey"
    FOREIGN KEY ("job_id") REFERENCES "matching"."jobs"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- ─── MARKET_INTEL SCHEMA ─────────────────────────────────────────────────────

CREATE TABLE "market_intel"."job_postings_raw" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "source" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,
    "raw_payload" JSONB NOT NULL,
    "ingested_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "job_postings_raw_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "job_postings_raw_source_source_id_key" ON "market_intel"."job_postings_raw"("source", "source_id");
CREATE INDEX "job_postings_raw_processed_idx" ON "market_intel"."job_postings_raw"("processed");

CREATE TABLE "market_intel"."skill_trends" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "skill_name" TEXT NOT NULL,
    "demand_count" INTEGER NOT NULL,
    "period_start" DATE NOT NULL,
    "period_end" DATE NOT NULL,
    "avg_salary_low" INTEGER,
    "avg_salary_high" INTEGER,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skill_trends_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "skill_trends_skill_name_period_start_period_end_key" ON "market_intel"."skill_trends"("skill_name", "period_start", "period_end");
CREATE INDEX "skill_trends_period_start_period_end_idx" ON "market_intel"."skill_trends"("period_start", "period_end");
CREATE INDEX "skill_trends_skill_name_idx" ON "market_intel"."skill_trends"("skill_name");

CREATE TABLE "market_intel"."salary_benchmarks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "role_title" TEXT NOT NULL,
    "location" TEXT NOT NULL DEFAULT 'global',
    "percentile_25" INTEGER,
    "percentile_50" INTEGER,
    "percentile_75" INTEGER,
    "sample_size" INTEGER NOT NULL DEFAULT 0,
    "period" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "salary_benchmarks_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "salary_benchmarks_role_title_location_period_key" ON "market_intel"."salary_benchmarks"("role_title", "location", "period");
CREATE INDEX "salary_benchmarks_role_title_idx" ON "market_intel"."salary_benchmarks"("role_title");
CREATE INDEX "salary_benchmarks_location_idx" ON "market_intel"."salary_benchmarks"("location");
