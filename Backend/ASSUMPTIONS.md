# Architectural Assumptions & Design Decisions

This document records key engineering assumptions, trade-offs, and instructions for how to change them as the platform evolves.

---

## 1. Vector Embedding Dimension

- **Decision:** Default embedding vector dimension set to **1536** (`VECTOR_DIMENSION=1536`).
- **Reason:** 1536 is the standard dimension for OpenAI `text-embedding-ada-002` and `text-embedding-3-small`, the industry baseline for semantic search.
- **Alternative Considered:** 768 or 384 dimensions (e.g. `all-MiniLM-L6-v2`, `bge-small-en`).
- **Trade-offs:** 1536 provides higher semantic fidelity at slightly higher memory and index storage costs in pgvector.
- **How to Change Later:**
  1. Update `VECTOR_DIMENSION` in `.env`.
  2. Create a Prisma migration:
     ```sql
     ALTER TABLE auth.profiles ALTER COLUMN embedding TYPE vector(NEW_DIMENSION);
     ALTER TABLE matching.jobs ALTER COLUMN embedding TYPE vector(NEW_DIMENSION);
     REINDEX INDEX auth.profiles_embedding_hnsw_idx;
     REINDEX INDEX matching.jobs_embedding_hnsw_idx;
     ```
  3. Ensure the AI Worker service generates embeddings matching `NEW_DIMENSION`.

---

## 2. Job-Market Intelligence Data Source

- **Decision:** Synthetic / mock job dataset (`synthetic-mock`).
- **Reason:** Public job portals require API keys, enterprise agreements, or explicitly prohibit web scraping under their Terms of Service. Synthetic data prevents legal and operational liabilities while providing predictable, deterministic inputs for local development, testing, and continuous integration.
- **Alternative Considered:** Scraping LinkedIn/Indeed (violates ToS) or Adzuna/Remotive public APIs (requires external network and API keys).
- **Trade-offs:** Synthetic data cannot be used for actual personal career planning or live business reporting. It is labeled as illustrative in all API responses.
- **How to Change Later:**
  1. Implement `IJobFetcher` in `src/market-intel/ingestion/` (e.g., `AdzunaJobFetcher`).
  2. In `MarketIntelModule`, change the provider binding:
     ```typescript
     {
       provide: JOB_FETCHER,
       useClass: AdzunaJobFetcher,
     }
     ```
  3. Configure required API credentials in `.env`.

---

## 3. Salary Data Interpretation & Disclaimers

- **Decision:** All salary metrics (percentiles, averages, midpoints) are synthetic and illustrative.
- **Reason:** Real salary data requires statistical weighting, regional cost-of-living adjustments, and verified compensation surveys.
- **Trade-offs:** Data is marked with `disclaimer: "⚠️ Synthetic data — illustrative only. NOT real market data."` on every market API response.
- **How to Change Later:**
  1. Integrate verified benchmark datasets (e.g., Levels.fyi or Bureau of Labor Statistics feeds).
  2. Adjust percentile calculations in `AggregationService` to account for equity, bonuses, and regional weighting.

---

## 4. Vector Index Choice: HNSW vs. IVFFlat

- **Decision:** **HNSW** (`m = 16, ef_construction = 64`) with cosine distance (`vector_cosine_ops`).
- **Reason:**
  - HNSW delivers >95% recall out-of-the-box without manual clustering.
  - HNSW handles dynamic, incremental job insertions without requiring full index rebuilds.
  - IVFFlat requires periodic retraining and re-clustering after significant inserts, and yields poor recall if created on an empty table.
- **Trade-offs:** HNSW uses more RAM than IVFFlat (~2–4x). For datasets up to 1 million jobs, memory usage is well within standard cloud database limits (e.g. 1GB–4GB RAM).
- **How to Change Later:**
  Run migration replacing the index:
  ```sql
  DROP INDEX matching.jobs_embedding_hnsw_idx;
  CREATE INDEX jobs_embedding_ivfflat_idx ON matching.jobs USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
  ```

---

## 5. Caching Strategy & Time-To-Live (TTL)

- **Decision:** Dual-layer matching cache: Redis sorted sets for sub-millisecond retrieval + PostgreSQL `matching.match_cache` for durable fallback. Default TTL: **3600 seconds (1 hour)**.
- **Reason:** Recommendations for a user remain stable until either the user's profile changes or a new job matching cycle runs.
- **Invalidation Trigger:** Invalidation is reactive and event-driven: when a user updates their profile, `user.profile.updated` is emitted, immediately evicting `match:{userId}:scores` from Redis and purging records from `matching.match_cache`.
- **How to Change Later:**
  Configure `CACHE_TTL` in `.env` to any desired integer (in seconds).

---

## 6. Event-Driven Messaging & Queue Mechanism

- **Decision:** In-process domain events via NestJS `EventEmitter2` (`@nestjs/event-emitter`) implementing an abstract `IEventBus` interface.
- **Reason:** Avoids external message broker dependencies (RabbitMQ, Kafka, AWS SQS) while keeping the monolith lightweight and independently testable.
- **Trade-offs:** Events are dispatched within the same Node.js process. In a distributed multi-node deployment, in-process events do not broadcast across nodes.
- **How to Upgrade Later:**
  Replace `EventEmitter2` in `SharedModule` with a BullMQ or Redis Streams adapter implementing `IEventBus`. Because all modules interact only via `IEventBus` and domain event interfaces (`UserProfileUpdatedEvent`, etc.), module business logic remains untouched.

---

## 7. Refresh Token Storage & Rotation

- **Decision:** Refresh tokens are generated as high-entropy random hex strings, hashed using **SHA-256** prior to storage in `auth.refresh_tokens`, and rotated on every single use.
- **Reason:**
  - Raw tokens are never stored in plaintext (protects against database read breaches).
  - SHA-256 is fast and appropriate for high-entropy secrets (Argon2 is reserved for user passwords).
  - Family-based tracking (`family_id` UUID) detects token replay: if a revoked token is re-submitted, the entire token family is revoked immediately, terminating all sessions for the compromised user.
- **How to Change Later:**
  Token lifetimes can be adjusted via `JWT_ACCESS_EXPIRY` and `JWT_REFRESH_EXPIRY` in `.env`.

---

## 8. Pagination Format & Defaults

- **Decision:** Standard offset-and-limit pagination returning `{ data: T[], meta: { page, limit, total, totalPages } }`. Default page size: 20, maximum: 100.
- **Reason:** Simple, universal client compatibility across web and mobile applications with predictable navigation controls.
- **Trade-offs:** Deep offset pagination on multi-million row tables can exhibit query performance degradation.
- **How to Upgrade Later:**
  For cursor-based pagination on high-throughput infinite scroll feeds, migrate `JobsRepository.findMany` to use keyset pagination (`WHERE id > :lastId`).

---

## 9. Public Profile Privacy Model

- **Decision:** Public profiles (`GET /v1/profiles/:id`) return only `{ id, fullName, headline, location, yearsExperience, skills }`.
- **Reason:** Protection of Personally Identifiable Information (PII) and security: `email`, `password_hash`, `preferences`, and raw vector embeddings are strictly excluded from public responses.
- **Trade-offs:** External viewers cannot see user preferences or contact emails without explicit future sharing features.

---

## 10. Frontend Integration Decisions

- **Decision:** `CORS_ORIGINS` default now includes `http://localhost:5173` (Vite's default dev port), in addition to the previous `3000`/`3001` defaults.
- **Reason:** The team's React frontend (`frontend/`) runs on Vite, whose default dev server port is `5173`, not `3001`.
- **How to Change Later:** Update `CORS_ORIGINS` in `.env` to match wherever the frontend is actually deployed.

- **Decision:** The frontend's `src/services/api/` layer is wired to real endpoints for **auth, profiles, job matching/jobs, and market skill-trends/salary-benchmarks**. `resumeApi`, `roadmapApi`, `careerApi`, and `notificationApi` remain mocked.
- **Reason:** Those four remaining modules depend on the Resume Module, AI/ML Worker, and Notifications service, none of which exist as backend endpoints yet — wiring them up would mean either fabricating endpoints that don't reflect real business logic, or guessing at contracts another engineer owns.
- **How to Change Later:** Once those modules exist, replace the `simulateLatency(...)` mock bodies in the corresponding frontend file with real `apiRequest(...)` calls, following the pattern in `jobsApi.ts`/`marketApi.ts`. Each mocked function already has a comment explaining exactly what it's waiting on.

- **Decision:** Frontend `User` fields the backend doesn't model (`education`, `graduationYear`, `targetCareer`) are stored inside the Profile's existing `preferences` JSONB field rather than adding new columns.
- **Reason:** `preferences` was already designed as a flexible bag for exactly this kind of UI-only data; adding dedicated columns for fields with no other backend consumer would be premature schema growth.
- **Trade-offs:** These fields aren't queryable/indexable. If they become load-bearing for matching or search, promote them to real columns.
- **How to Change Later:** Add columns to `Profile` in `schema.prisma`, migrate, and update `UpdateProfileDto` + `frontend/src/services/api/profileApi.ts`'s mapping.

- **Decision:** The frontend's richer `Job` fields with no backend equivalent (`experience`, `type`, `requirements`, `responsibilities`, `benefits`, `companyInfo`) are populated with fixed placeholders (`'Not specified'`, `'Full-time'`, empty arrays/strings) rather than fabricated content.
- **Reason:** The `Job` schema intentionally stores only `title/company/description/location/remote/salaryMin-Max/skillsRequired` (see §1-4). Inventing structured requirements/benefits text would misrepresent synthetic placeholder text as real job data.
- **How to Change Later:** If these fields become real product requirements, add them to the `Job` Prisma model, the ingestion pipeline, and the seed data — then remove the placeholders in `frontend/src/services/api/jobsApi.ts`.

- **Decision:** "Save job" (`toggleSaveJob`) is implemented as client-only state (`localStorage`), not synced to the backend.
- **Reason:** No `/v1/jobs/:id/save` endpoint exists, and adding one wasn't part of the approved integration scope.
- **How to Change Later:** Add a `SavedJob` table/endpoint in the Matching module, then replace the `localStorage` logic in `jobsApi.ts` with a real API call.

- **Decision:** `getTrendingSkills()` maps the backend's `demandCount` (a raw posting count) directly into the frontend's `TrendingSkill.demandChange` field. The Market page label was changed from "+N%" to "N postings" to match (`frontend/src/pages/Market/Market.tsx`).
- **Reason:** `demandCount` is the only real demand signal the backend computes; there is no percentage-change calculation in `AggregationService`. Displaying it with a "%" suffix (as originally built) fabricated a growth-rate claim the data doesn't support.
- **How to Change Later:** If a true period-over-period percentage is wanted, compute it in `AggregationService.getSkillTrends` by comparing `demandCount` against the prior period's value for the same skill, then restore a "%" label.

- **Decision:** Job matches will be empty (with a `hint` message) for any user until their `Profile.embedding` is set.
- **Reason:** Embedding generation is the AI Worker's responsibility (see §10 below); this backend intentionally never auto-generates embeddings outside of tests, even though a `MockEmbeddingProvider` exists.
- **How to Change Later:** Once the AI Worker is online, it should call `ProfilesService.updateEmbedding(userId, embedding)` after processing a resume/profile — the Matching module and frontend already handle the "no embedding yet" and "has embedding" cases correctly on both ends.

## 11. Post-Integration Bug Fixes (Audit Pass)

After the initial frontend↔backend wiring, a full read-through audit of both codebases (not just the diff) surfaced several real defects, fixed here rather than just documented, plus a couple left as documented gaps:

- **Fixed — Critical: `/v1/auth/refresh` never returned the rotated refresh token.** `AuthService.refresh()` generated and persisted (as a hash) a new refresh token on every call, but its return type was only `{accessToken, expiresIn}` — the plaintext new token was discarded. Effect: after exactly one refresh cycle, the client's only refresh token was already revoked server-side; the next refresh attempt would present that stale token, trip reuse-detection, and revoke the entire session family — a real, guaranteed session-death bug, not an edge case. Fixed by returning `{accessToken, refreshToken, expiresIn}` (`src/auth/auth.service.ts`) and updating the frontend's `client.ts` to store both tokens from the refresh response, not just the access token.
- **Fixed — High: refresh-token rotation had a TOCTOU race that defeated reuse detection.** `AuthRepository.rotateRefreshToken` did an unconditional `update({revoked: true})` with no check on the row's current state, so two concurrent `/refresh` calls with the same still-valid token (e.g. a legitimate client racing a replayed/stolen token) could both pass the pre-check and both successfully mint a child token — silently defeating the "family-based reuse detection" the design relies on. Fixed by making the revoke conditional (`updateMany({where: {tokenHash, revoked: false}})`) and checking the affected-row count inside the transaction; a count of 0 means a concurrent request won the race, and is now treated as reuse (revokes the whole family) instead of silently succeeding twice.
- **Fixed — High: the match cache ignored request filters.** `MatchingService.getMatches` cached/read results keyed only by `userId`, with no fingerprint of the `location`/`remote`/`salaryMin`/`salaryMax` filters used to compute them. A cache populated by an unfiltered request would be served verbatim to a subsequently *filtered* request (or vice versa) until the 1-hour TTL expired or a profile update invalidated it. Fixed by bypassing the cache entirely (both read and write) whenever any filter is present — only the default unfiltered ranking is ever cached.
- **Fixed — Medium: market ingestion's "idempotent dedup" had a race window.** `RawPostingsRepository.upsertRaw` was a check-then-insert (`findUnique` then `create`), not an atomic operation, despite the architecture documenting `ON CONFLICT DO NOTHING`-style idempotency. Two concurrent ingestion runs could both see "not existing" and both attempt `create`, with the loser surfacing as a hard error instead of a graceful duplicate. Fixed by making `create` the atomic boundary and catching the unique-constraint violation (Prisma `P2002`) to look up and return the existing row instead.
- **Fixed — Low: `SkillTrend.avgSalaryLow/avgSalaryHigh` weren't actually averages.** `AggregationService` computed them as `Math.min`/`Math.max` of each job's salary midpoint — a min/max range mislabeled as an average. Fixed to track each job's `salaryMin`/`salaryMax` separately per skill and average those, matching the field names' actual meaning.
- **Fixed — Low: match explanations silently fabricated a similarity score.** `getMatchExplanation` fell back to a hardcoded `0.7` "similarity" when a job was never actually ranked for the user (e.g. called directly without going through `/matches` first), which could produce a "Strong match" label with no real computation behind it. Added a `scoreSource: 'ranked' | 'estimated'` field to the response so callers can tell the difference — the deterministic-explanation guarantee only applies to `'ranked'`.
- **Fixed — Frontend: onboarding data was collected but never sent to the backend.** The onboarding wizard (`frontend/src/pages/Onboarding/`) gathered name/location/education/graduation year/experience level/career goal into local state and then discarded all of it except `name` on completion. Wired `Onboarding.tsx`'s completion handler to call `profileApi.updateProfile(...)` with everything collected except `skills` (which the backend correctly refuses to accept here — see the "skills field protected" behavior in `ProfilesService` — until a real Resume Module exists to own that field). Also added the missing `experienceLevel → yearsExperience` reverse mapping in `profileApi.ts`, without which this data had no path to the backend at all.
- **Fixed — Frontend: "Save Job" could report a real job as not found.** `jobsApi.toggleSaveJob` only ever looked in the last list returned by `getRecommendedJobs()`; reaching a job via a direct link, a page refresh, or while matches were empty (see below) meant the job wasn't in that list, so toggling "save" made `JobDetails.tsx` render "Job not found." Fixed by fetching the job directly when it's missing from the cached list.
- **Fixed — Frontend: the "no matches yet" reason was silently dropped.** The backend's `hint` field (explaining that matches are empty because no profile embedding exists yet — the expected state for every new signup) was fetched but never surfaced; the Jobs page told users to "adjust your filters," which cannot fix the actual cause. Added `getRecommendedJobsHint()` to `jobsApi.ts` and a dedicated empty-state message in `Jobs.tsx` for this case specifically (only shown when no filters are active, so it doesn't mask genuine "no results for this filter" states).
- **Fixed — Frontend: a stale-profile race on rapid auth-state changes.** `AppContext`'s profile-loading effect had no cancellation guard; a `getProfile()` call from a previous auth state could resolve after a fast logout (or re-login) and overwrite `user` with stale data. Added an `ignore` flag cleanup, the standard React pattern for this.
- **Documented, not fixed — pgvector query planner risk.** `JobsRepository`'s similarity query combines `WHERE` filters (location/remote/salary) with `ORDER BY ... <=> ... LIMIT` against the HNSW index. Depending on the pgvector version and `hnsw.iterative_scan` setting, mixing filtered predicates with ANN ordering can cause Postgres to abandon the index plan or return fewer than `LIMIT` results after filtering. Needs verification against the actual deployed pgvector version — not something to guess-fix without a real database to test against.
- **Documented, not fixed — pagination `total` can overstate results if a matched job was hard-deleted.** `MatchingService.getMatches` reports `meta.total` from the pre-filter candidate count, so if a job referenced by a cached match was deleted from the database, a page can return fewer than `limit` items while `total`/`totalPages` still reflect the stale count. Rare (requires a hard delete of a job with existing cached matches) and would require an extra existence check across the *entire* candidate set (not just the current page) to fix properly — left as a known edge case rather than adding that overhead for the MVP.

## 12. External Module Contracts (Resume, AI Worker, Notifications)

- **Resume Module:** Assumed to parse resumes asynchronously and invoke `ProfileSkillsUpdater.updateSkills(userId, skills)`. Auth & Profiles module owns the database table; Resume Module never executes raw DB mutations.
- **AI Worker:** Assumed to consume text and output embedding arrays of length `VECTOR_DIMENSION`. The backend provides `MockEmbeddingProvider` for local autonomy and integration tests.
- **Notifications:** Assumed to listen for domain events (`user.profile.updated`, `market.trends.updated`). Backend does not depend on notification delivery infrastructure.
