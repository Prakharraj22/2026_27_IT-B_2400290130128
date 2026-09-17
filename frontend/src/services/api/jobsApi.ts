import { apiRequest } from './client';
import type { Job } from '../../types';

// Raw shape of Backend/src/matching/jobs.repository.ts / Prisma `Job` model.
interface BackendJob {
  id: string;
  title: string;
  company: string;
  description?: string;
  location?: string;
  remote: boolean;
  salaryMin?: number;
  salaryMax?: number;
  skillsRequired: string[];
  postedAt?: string;
}

interface MatchInfo {
  similarityScore: number;
  skillOverlapScore: number;
  finalScore: number;
  matchingSkills: string[];
  missingSkills: string[];
}

interface MatchesResponse {
  data: Array<{ job: BackendJob } & MatchInfo>;
  meta: { page: number; limit: number; total: number; totalPages: number };
  hint?: string;
}

interface JobsResponse {
  data: BackendJob[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

const SAVED_JOBS_KEY = 'careerai-saved-job-ids';

function getSavedIds(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(SAVED_JOBS_KEY) || '[]'));
  } catch {
    return new Set();
  }
}

function persistSavedIds(ids: Set<string>): void {
  localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify([...ids]));
}

function formatSalary(min?: number, max?: number): string {
  // `== null` (not falsy checks) so a legitimate salary of 0 isn't treated
  // the same as "not disclosed".
  if (min == null && max == null) return 'Not disclosed';
  const fmt = (n: number) => `$${Math.round(n / 1000)}k`;
  if (min != null && max != null) return `${fmt(min)} - ${fmt(max)}`;
  return fmt((min ?? max)!);
}

function daysAgo(iso?: string): number {
  if (!iso) return 0;
  const diff = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

// The backend's Job model (Backend/prisma/schema.prisma) only has
// { title, company, description, location, remote, salaryMin/Max,
// skillsRequired, postedAt }. It has no employment `type`, `experience`
// level, structured requirements/responsibilities/benefits, or company
// blurb, and no "saved job" endpoint exists — those are placeholders /
// client-only state below, not fabricated backend data.
function toJob(raw: BackendJob, match: MatchInfo | undefined, savedIds: Set<string>): Job {
  return {
    id: raw.id,
    title: raw.title,
    company: raw.company,
    location: raw.location || 'Not specified',
    remote: raw.remote,
    salary: formatSalary(raw.salaryMin, raw.salaryMax),
    experience: 'Not specified',
    type: 'Full-time',
    requiredSkills: raw.skillsRequired || [],
    matchingSkills: match?.matchingSkills || [],
    missingSkills: match?.missingSkills ?? raw.skillsRequired ?? [],
    compatibility: match ? Math.round(match.finalScore * 100) : 0,
    description: raw.description || '',
    requirements: [],
    responsibilities: [],
    benefits: [],
    companyInfo: '',
    postedDaysAgo: daysAgo(raw.postedAt),
    saved: savedIds.has(raw.id),
  };
}

// Kept in memory so toggleSaveJob (client-only — no backend endpoint exists
// for bookmarking) can return the full updated list without refetching.
let lastFetched: Job[] = [];

// Set alongside `lastFetched` when the backend returns zero matches because
// the user has no profile embedding yet (day-one state for every signup).
// Exposed separately since `getRecommendedJobs` must keep returning `Job[]`
// for existing callers — read via `getRecommendedJobsHint()` to show the
// caller *why* the list is empty instead of generic "no results" copy.
let lastHint: string | null = null;

export function getRecommendedJobsHint(): string | null {
  return lastHint;
}

// GET /v1/matches — personalized, ranked recommendations.
// Until a profile embedding exists (set by the AI Worker, out of scope here),
// the backend returns an empty list with a `hint` explaining why.
export async function getRecommendedJobs(): Promise<Job[]> {
  const res = await apiRequest<MatchesResponse>('/matches?limit=50');
  const savedIds = getSavedIds();
  lastFetched = res.data.map((m) => toJob(m.job, m, savedIds));
  lastHint = res.hint ?? null;
  return lastFetched;
}

// GET /v1/jobs/:id + GET /v1/matches/:jobId/why (deterministic score/skill breakdown).
export async function getJobDetails(id: string): Promise<Job | undefined> {
  const raw = await apiRequest<BackendJob>(`/jobs/${id}`).catch(() => undefined);
  if (!raw) return undefined;

  const match = await apiRequest<MatchInfo>(`/matches/${id}/why`).catch(() => undefined);
  const savedIds = getSavedIds();
  return toJob(raw, match, savedIds);
}

// PATCH /v1/jobs/:id/save — no such endpoint exists on the backend yet.
// Bookmarking is implemented as client-only state persisted to localStorage.
export async function toggleSaveJob(id: string): Promise<Job[]> {
  const savedIds = getSavedIds();
  if (savedIds.has(id)) savedIds.delete(id);
  else savedIds.add(id);
  persistSavedIds(savedIds);

  if (lastFetched.some((j) => j.id === id)) {
    lastFetched = lastFetched.map((j) => (j.id === id ? { ...j, saved: savedIds.has(id) } : j));
  } else {
    // The job wasn't in the last fetched list — e.g. reached via a direct
    // link, a page refresh, or because getRecommendedJobs() returned []
    // (no profile embedding yet). Fetch it so callers that expect the
    // toggled job to be present in the returned list (JobDetails.tsx) don't
    // wrongly conclude the job doesn't exist.
    const fetched = await getJobDetails(id);
    if (fetched) lastFetched = [...lastFetched, { ...fetched, saved: savedIds.has(id) }];
  }
  return lastFetched;
}

// GET /v1/jobs — general browse/search, independent of the matching engine.
export async function searchJobs(params: { search?: string; location?: string; remote?: boolean } = {}): Promise<Job[]> {
  const qs = new URLSearchParams();
  if (params.search) qs.set('search', params.search);
  if (params.location) qs.set('location', params.location);
  if (params.remote !== undefined) qs.set('remote', String(params.remote));
  qs.set('limit', '50');

  const res = await apiRequest<JobsResponse>(`/jobs?${qs.toString()}`);
  const savedIds = getSavedIds();
  return res.data.map((j) => toJob(j, undefined, savedIds));
}
