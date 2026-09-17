import { simulateLatency } from './client';
import { jobs as initialJobs, getJobById } from '../../data/jobs';
import type { Job } from '../../types';

let jobStore: Job[] = [...initialJobs];

// GET /v1/jobs
export async function getRecommendedJobs(): Promise<Job[]> {
  return simulateLatency(jobStore);
}

// GET /v1/jobs/:id
export async function getJobDetails(id: string): Promise<Job | undefined> {
  return simulateLatency(getJobById(id) ?? jobStore.find((j) => j.id === id), 400);
}

// PATCH /v1/jobs/:id/save
export async function toggleSaveJob(id: string): Promise<Job[]> {
  jobStore = jobStore.map((j) => (j.id === id ? { ...j, saved: !j.saved } : j));
  return simulateLatency(jobStore, 250);
}
