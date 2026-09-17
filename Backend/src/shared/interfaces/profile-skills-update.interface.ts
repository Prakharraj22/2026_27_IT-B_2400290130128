export const PROFILE_SKILLS_UPDATER = 'PROFILE_SKILLS_UPDATER';

/**
 * Interface exposed to the Resume Module.
 * The Resume Module calls this to write parsed skills back to the profile.
 * Auth/Profiles module owns the DB write.
 */
export interface ProfileSkillsUpdater {
  updateSkills(userId: string, skills: string[]): Promise<void>;
  updateEmbedding(userId: string, embedding: number[]): Promise<void>;
}
