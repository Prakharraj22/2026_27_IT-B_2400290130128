import { apiRequest, simulateLatency } from './client';
import {
  userProjects, userExperience, userCertifications, userInterests,
} from '../../data/users';
import type { User, UserSkill, Project, Experience, Certification } from '../../types';

// Shape returned by GET/PATCH /v1/profiles/me (see Backend/src/profiles/dto/profile-response.dto.ts).
interface BackendProfile {
  id: string;
  userId: string;
  email?: string;
  fullName?: string;
  headline?: string;
  location?: string;
  yearsExperience?: number;
  skills: string[];
  preferences: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

const AVATAR_COLORS = ['#F87171', '#FB923C', '#FBBF24', '#4ADE80', '#22D3EE', '#818CF8', '#F472B6'];

function colorForName(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function experienceLevelFromYears(years?: number): User['experienceLevel'] {
  if (years === undefined || years === null) return 'Student';
  if (years === 0) return 'Fresher';
  if (years <= 3) return '1-3 years';
  if (years <= 5) return '3-5 years';
  return '5+ years';
}

// Inverse of experienceLevelFromYears, for writing the onboarding/profile
// form's categorical selection back to the backend's numeric yearsExperience.
// Picks the midpoint of each bucket; 'Student' has no numeric equivalent.
function yearsFromExperienceLevel(level?: User['experienceLevel']): number | undefined {
  switch (level) {
    case 'Fresher': return 0;
    case '1-3 years': return 2;
    case '3-5 years': return 4;
    case '5+ years': return 6;
    default: return undefined;
  }
}

// The backend's Profile schema only stores { fullName, headline, location,
// yearsExperience, skills, preferences }. Fields the UI wants but the backend
// doesn't model yet (education, graduationYear, targetCareer) are kept inside
// the generic `preferences` JSON bag, which the schema documents as being for
// exactly this kind of flexible, non-core data.
function toUser(p: BackendProfile): User {
  const prefs = p.preferences || {};
  const filledFields = [p.fullName, p.headline, p.location, p.yearsExperience, p.skills?.length > 0].filter(Boolean).length;
  return {
    id: p.userId,
    name: p.fullName || '',
    email: p.email || '',
    location: p.location || '',
    education: (prefs.education as string) || '',
    graduationYear: (prefs.graduationYear as number) ?? new Date().getFullYear(),
    experienceLevel: experienceLevelFromYears(p.yearsExperience),
    avatarColor: colorForName(p.fullName || p.email || p.userId),
    targetCareer: (prefs.targetCareer as string) || '',
    profileCompleteness: Math.round((filledFields / 5) * 100),
  };
}

// GET /v1/profiles/me
export async function getProfile(): Promise<User> {
  const profile = await apiRequest<BackendProfile>('/profiles/me');
  return toUser(profile);
}

// PATCH /v1/profiles/me — merges UI-only fields into `preferences` so a
// partial update never clobbers previously stored preference data.
export async function updateProfile(updates: Partial<User>): Promise<User> {
  const current = await apiRequest<BackendProfile>('/profiles/me');
  const nextPreferences = { ...current.preferences };
  if (updates.education !== undefined) nextPreferences.education = updates.education;
  if (updates.graduationYear !== undefined) nextPreferences.graduationYear = updates.graduationYear;
  if (updates.targetCareer !== undefined) nextPreferences.targetCareer = updates.targetCareer;

  const body: Record<string, unknown> = { preferences: nextPreferences };
  if (updates.name !== undefined) body.fullName = updates.name;
  if (updates.location !== undefined) body.location = updates.location;
  if (updates.experienceLevel !== undefined) {
    const years = yearsFromExperienceLevel(updates.experienceLevel);
    if (years !== undefined) body.yearsExperience = years;
  }

  const updated = await apiRequest<BackendProfile>('/profiles/me', { method: 'PATCH', body });
  return toUser(updated);
}

// GET /v1/profiles/me (skills subset). Proficiency has no backend equivalent
// yet — skills are plain strings owned by the Resume Module — so it's shown
// as a placeholder until that module supplies real proficiency levels.
export async function getSkills(): Promise<UserSkill[]> {
  const profile = await apiRequest<BackendProfile>('/profiles/me');
  return (profile.skills || []).map((name) => ({ name, proficiency: 'Intermediate' as const }));
}

// The backend has no Projects/Experience/Certifications/Interests tables —
// these belong to a richer profile/resume schema that hasn't been built yet.
// Kept mocked until the Resume Module (or a future Profile extension) exists.
export async function getProjects(): Promise<Project[]> {
  return simulateLatency(userProjects);
}

export async function getExperience(): Promise<Experience[]> {
  return simulateLatency(userExperience);
}

export async function getCertifications(): Promise<Certification[]> {
  return simulateLatency(userCertifications);
}

export async function getInterests(): Promise<string[]> {
  return simulateLatency(userInterests);
}
