import { simulateLatency } from './client';
import { trendingSkills, emergingTechnologies, careerDemandByLocation, salaryTrends } from '../../data/skills';

// GET /v1/market/trending-skills
export async function getTrendingSkills() {
  return simulateLatency(trendingSkills);
}

// GET /v1/market/emerging
export async function getEmergingTechnologies() {
  return simulateLatency(emergingTechnologies);
}

// GET /v1/market/demand-by-location
export async function getDemandByLocation() {
  return simulateLatency(careerDemandByLocation);
}

// GET /v1/market/salary-trends
export async function getSalaryTrends() {
  return simulateLatency(salaryTrends);
}
