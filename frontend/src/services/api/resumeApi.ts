import { simulateLatency } from './client';
import { mockResumeAnalysis } from '../../data/notifications';
import type { ResumeAnalysis } from '../../types';

// POST /v1/resume/upload
export async function uploadResume(_file: File): Promise<ResumeAnalysis> {
  return simulateLatency(mockResumeAnalysis, 1800);
}

// GET /v1/resume/analysis
export async function getResumeAnalysis(): Promise<ResumeAnalysis> {
  return simulateLatency(mockResumeAnalysis, 400);
}
