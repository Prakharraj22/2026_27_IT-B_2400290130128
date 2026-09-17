import { simulateLatency } from './client';
import { mockResumeAnalysis } from '../../data/notifications';
import type { ResumeAnalysis } from '../../types';

// Kept mocked: resume parsing/analysis belongs to the Resume Module, which is
// owned by another engineer and has no backend endpoint yet. Once it exists,
// `uploadResume` should POST multipart form data and `getResumeAnalysis`
// should GET the stored analysis, both under a real `/v1/resume/...` route.

// POST /v1/resume/upload
export async function uploadResume(_file: File): Promise<ResumeAnalysis> {
  return simulateLatency(mockResumeAnalysis, 1800);
}

// GET /v1/resume/analysis
export async function getResumeAnalysis(): Promise<ResumeAnalysis> {
  return simulateLatency(mockResumeAnalysis, 400);
}
