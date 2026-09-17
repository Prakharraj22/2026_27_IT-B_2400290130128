import { simulateLatency } from './client';
import {
  currentUser, userSkills, userProjects, userExperience, userCertifications, userInterests,
} from '../../data/users';
import type { User, UserSkill, Project, Experience, Certification } from '../../types';

// GET /v1/profile
export async function getProfile(): Promise<User> {
  return simulateLatency(currentUser);
}

// GET /v1/profile/skills
export async function getSkills(): Promise<UserSkill[]> {
  return simulateLatency(userSkills);
}

// GET /v1/profile/projects
export async function getProjects(): Promise<Project[]> {
  return simulateLatency(userProjects);
}

// GET /v1/profile/experience
export async function getExperience(): Promise<Experience[]> {
  return simulateLatency(userExperience);
}

// GET /v1/profile/certifications
export async function getCertifications(): Promise<Certification[]> {
  return simulateLatency(userCertifications);
}

// GET /v1/profile/interests
export async function getInterests(): Promise<string[]> {
  return simulateLatency(userInterests);
}

// PATCH /v1/profile
export async function updateProfile(updates: Partial<User>): Promise<User> {
  return simulateLatency({ ...currentUser, ...updates }, 300);
}
