import { apiRequest, simulateLatency } from './client';
import { emergingTechnologies, careerDemandByLocation } from '../../data/skills';
import type { TrendingSkill } from '../../types';

interface SkillTrendsResponse {
  data: Array<{ skillName: string; demandCount: number }>;
  disclaimer: string;
}

interface SalaryBenchmarksResponse {
  data: Array<{ roleTitle: string; percentile25?: number; percentile50?: number; percentile75?: number }>;
  disclaimer: string;
}

const fmtK = (n?: number) => (n ? `$${Math.round(n / 1000)}k` : 'N/A');

// GET /v1/market/skill-trends — backend returns a raw `demandCount` (postings
// mentioning the skill), not a percentage change. Mapped into `demandChange`
// as-is since it's the only real demand signal available; it is a count, not
// a percent, even though the current Market page renders it with a "%" sign.
export async function getTrendingSkills(): Promise<TrendingSkill[]> {
  const res = await apiRequest<SkillTrendsResponse>('/market/skill-trends?limit=15');
  return res.data.map((s) => ({ name: s.skillName, demandChange: s.demandCount, category: 'General' }));
}

// GET /v1/market/salary-benchmarks
export async function getSalaryTrends(): Promise<{ role: string; range: string; median: string }[]> {
  const res = await apiRequest<SalaryBenchmarksResponse>('/market/salary-benchmarks');
  return res.data.map((b) => ({
    role: b.roleTitle,
    range: `${fmtK(b.percentile25)} - ${fmtK(b.percentile75)}`,
    median: fmtK(b.percentile50),
  }));
}

// The backend's Market Intelligence module has no concept of "emerging
// technologies" or "demand by location" — it only tracks skill-trends and
// salary-benchmarks. Kept mocked until that scope is designed and built.
export async function getEmergingTechnologies(): Promise<string[]> {
  return simulateLatency(emergingTechnologies);
}

export async function getDemandByLocation(): Promise<{ location: string; demand: number }[]> {
  return simulateLatency(careerDemandByLocation);
}
