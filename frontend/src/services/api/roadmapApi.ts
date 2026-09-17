import { simulateLatency } from './client';
import { roadmapSteps as initialSteps } from '../../data/roadmap';
import type { RoadmapStep } from '../../types';

// Kept mocked: AI-generated learning roadmaps depend on the AI/ML Worker
// (owned by another engineer), which the backend has no endpoint for yet.

let steps: RoadmapStep[] = [...initialSteps];

// GET /v1/roadmap
export async function getRoadmap(): Promise<RoadmapStep[]> {
  return simulateLatency(steps);
}

// PATCH /v1/roadmap/:id/complete
export async function markStepComplete(id: string): Promise<RoadmapStep[]> {
  steps = steps.map((s) => (s.id === id ? { ...s, status: 'Completed', progress: 100 } : s));
  return simulateLatency(steps, 300);
}
