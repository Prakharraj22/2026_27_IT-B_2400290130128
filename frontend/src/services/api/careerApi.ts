import { simulateLatency } from './client';
import { careers, getCareerById } from '../../data/careers';
import { skillGapForBackendDeveloper } from '../../data/skills';
import type { Career, SkillGapItem } from '../../types';

// Kept mocked: career-path recommendations and skill-gap analysis require
// AI/LLM reasoning (AI Worker, owned by another engineer). The backend's
// Matching module only ranks concrete job postings, not abstract careers —
// there is no `/v1/careers` endpoint to wire this up to yet.

// GET /v1/careers
export async function getCareerRecommendations(): Promise<Career[]> {
  return simulateLatency(careers);
}

// GET /v1/careers/:id
export async function getCareerDetails(id: string): Promise<Career | undefined> {
  return simulateLatency(getCareerById(id), 400);
}

// GET /v1/careers/skill-gap?target=
export async function getSkillGap(_targetCareerId?: string): Promise<SkillGapItem[]> {
  return simulateLatency(skillGapForBackendDeveloper);
}
