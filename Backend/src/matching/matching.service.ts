import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { JobsRepository, JobFilters } from './jobs.repository';
import { MatchCacheRepository } from './match-cache.repository';
import { ProfilesService } from '../profiles/profiles.service';
import { EVENTS, UserProfileUpdatedEvent } from '../shared/events/event-bus.interface';
import { paginate } from '../shared/utils/pagination';

export interface MatchResult {
  job: any;
  similarityScore: number;
  skillOverlapScore: number;
  finalScore: number;
  matchingSkills: string[];
  missingSkills: string[];
}

@Injectable()
export class MatchingService {
  private readonly logger = new Logger(MatchingService.name);

  constructor(
    private readonly jobsRepository: JobsRepository,
    private readonly matchCacheRepository: MatchCacheRepository,
    private readonly profilesService: ProfilesService,
  ) {}

  async getMatches(
    userId: string,
    filters: JobFilters,
    page: number,
    limit: number,
  ) {
    const profileEmbedding = await this.profilesService.getProfileEmbedding(userId);

    if (!profileEmbedding) {
      return {
        data: [],
        meta: { page, limit, total: 0, totalPages: 0 },
        hint: 'Complete your profile to enable semantic job matching. Vectors will be generated once your profile is analyzed.',
      };
    }

    const cached = await this.matchCacheRepository.getCachedMatches(userId);
    let allMatches: Array<{ jobId: string; score: number }>;

    if (cached && cached.length > 0) {
      this.logger.debug(`Cache hit for user ${userId}`);
      allMatches = cached;
    } else {
      allMatches = await this.computeMatches(userId, profileEmbedding, filters);
      await this.matchCacheRepository.cacheMatches(userId, allMatches);
    }

    const skip = (page - 1) * limit;
    const pagedMatches = allMatches.slice(skip, skip + limit);

    const profileData = await this.profilesService.getMyProfile(userId).catch(() => null);
    const profileSkills: string[] = (profileData?.skills || []).map((s: string) => s.toLowerCase());

    const jobDetails = await Promise.all(
      pagedMatches.map(async (m) => {
        const job = await this.jobsRepository.findById(m.jobId);
        if (!job) return null;

        const jobSkills = ((job.skillsRequired as string[]) || []).map((s) => s.toLowerCase());
        const matchingSkills = profileSkills.filter((s) => jobSkills.includes(s));
        const missingSkills = jobSkills.filter((s) => !profileSkills.includes(s));
        const overlapRatio = jobSkills.length > 0 ? matchingSkills.length / jobSkills.length : 0;
        const skillOverlapScore = Math.round(overlapRatio * 0.2 * 1000) / 1000;
        const similarityScore = Math.round(Math.max(0, (m.score - skillOverlapScore) / 0.8) * 1000) / 1000;

        return {
          job,
          similarityScore,
          skillOverlapScore,
          finalScore: Math.round(m.score * 1000) / 1000,
          matchingSkills: matchingSkills.map(
            (s) => (job.skillsRequired as string[]).find((js) => js.toLowerCase() === s) || s,
          ),
          missingSkills: missingSkills.map(
            (s) => (job.skillsRequired as string[]).find((js) => js.toLowerCase() === s) || s,
          ),
        };
      }),
    );

    const validResults = jobDetails.filter(Boolean);
    return paginate(validResults, allMatches.length, page, limit);
  }

  async getMatchExplanation(userId: string, jobId: string) {
    const job = await this.jobsRepository.findById(jobId);
    if (!job) {
      throw new NotFoundException({ code: 'JOB_NOT_FOUND', message: 'Job not found' });
    }

    const profileData = await this.profilesService.getMyProfile(userId).catch(() => null);
    const profileSkills: string[] = (profileData?.skills || []).map((s: string) => s.toLowerCase());

    const jobSkills = ((job.skillsRequired as string[]) || []).map((s) => s.toLowerCase());
    const matchingSkills = profileSkills.filter((s) => jobSkills.includes(s));
    const missingSkills = jobSkills.filter((s) => !profileSkills.includes(s));
    const overlapRatio = jobSkills.length > 0 ? matchingSkills.length / jobSkills.length : 0;
    const skillOverlapScore = Math.round(overlapRatio * 0.2 * 1000) / 1000;

    const cached = await this.matchCacheRepository.getDbMatches(userId);
    const cachedEntry = cached.find((m) => m.jobId === jobId);
    const finalScore = cachedEntry?.score ?? (0.7 * 0.8 + skillOverlapScore);
    const similarityScore = Math.round(Math.max(0, (finalScore - skillOverlapScore) / 0.8) * 1000) / 1000;

    const totalJobSkills = jobSkills.length;
    const matchedSkillCount = matchingSkills.length;
    const strength =
      finalScore >= 0.8 ? 'Strong' : finalScore >= 0.6 ? 'Good' : 'Moderate';

    return {
      jobId,
      similarityScore,
      skillOverlapScore,
      finalScore: Math.round(finalScore * 1000) / 1000,
      matchingSkills: matchingSkills.map(
        (s) => (job.skillsRequired as string[]).find((js) => js.toLowerCase() === s) || s,
      ),
      missingSkills: missingSkills.map(
        (s) => (job.skillsRequired as string[]).find((js) => js.toLowerCase() === s) || s,
      ),
      totalJobSkills,
      matchedSkillCount,
      explanation: `${strength} match. You possess ${matchedSkillCount} of ${totalJobSkills} key skills required for this position.`,
    };
  }

  private async computeMatches(
    userId: string,
    profileEmbedding: number[],
    filters: JobFilters,
  ): Promise<Array<{ jobId: string; score: number }>> {
    const profileData = await this.profilesService.getMyProfile(userId).catch(() => null);
    const profileSkills: string[] = (profileData?.skills || []).map((s: string) => s.toLowerCase());

    const similarJobs = await this.jobsRepository.findSimilarJobs(
      profileEmbedding,
      filters,
      100,
    );

    const scored = await Promise.all(
      similarJobs.map(async ({ id: jobId, score: similarityScore }) => {
        const job = await this.jobsRepository.findById(jobId);
        if (!job) return null;

        const jobSkills = ((job.skillsRequired as string[]) || []).map((s) => s.toLowerCase());
        const matchedSkills = profileSkills.filter((s) => jobSkills.includes(s));
        const overlapRatio = jobSkills.length > 0 ? matchedSkills.length / jobSkills.length : 0;
        const boost = overlapRatio * 0.2;

        const finalScore = Math.max(0, Math.min(1, similarityScore * 0.8 + boost));
        return { jobId, score: finalScore };
      }),
    );

    return scored
      .filter((item): item is { jobId: string; score: number } => item !== null)
      .sort((a, b) => b.score - a.score);
  }

  @OnEvent(EVENTS.USER_PROFILE_UPDATED)
  async handleProfileUpdated(event: UserProfileUpdatedEvent): Promise<void> {
    this.logger.debug(
      `Invalidating match cache for user ${event.userId} (fields updated: ${event.updatedFields.join(', ')})`,
    );
    await this.matchCacheRepository.invalidateCache(event.userId);
  }
}
