import { Test, TestingModule } from '@nestjs/testing';
import { MatchingService } from '../../src/matching/matching.service';
import { JobsRepository } from '../../src/matching/jobs.repository';
import { MatchCacheRepository } from '../../src/matching/match-cache.repository';
import { ProfilesService } from '../../src/profiles/profiles.service';

describe('MatchingService (Unit Tests)', () => {
  let service: MatchingService;
  let jobsRepo: jest.Mocked<JobsRepository>;
  let cacheRepo: jest.Mocked<MatchCacheRepository>;
  let profilesService: jest.Mocked<ProfilesService>;

  beforeEach(async () => {
    const mockJobsRepo = {
      findById: jest.fn(),
      findMany: jest.fn(),
      findSimilarJobs: jest.fn(),
    };

    const mockCacheRepo = {
      getCachedMatches: jest.fn(),
      cacheMatches: jest.fn(),
      invalidateCache: jest.fn(),
      getDbMatches: jest.fn(),
    };

    const mockProfilesService = {
      getProfileEmbedding: jest.fn(),
      getMyProfile: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchingService,
        { provide: JobsRepository, useValue: mockJobsRepo },
        { provide: MatchCacheRepository, useValue: mockCacheRepo },
        { provide: ProfilesService, useValue: mockProfilesService },
      ],
    }).compile();

    service = module.get<MatchingService>(MatchingService);
    jobsRepo = module.get(JobsRepository);
    cacheRepo = module.get(MatchCacheRepository);
    profilesService = module.get(ProfilesService);
  });

  describe('getMatches ranking algorithm', () => {
    it('should compute hybrid score with 80% semantic and 20% skill overlap', async () => {
      profilesService.getProfileEmbedding.mockResolvedValue([0.1, 0.2, 0.3]);
      cacheRepo.getCachedMatches.mockResolvedValue(null);

      profilesService.getMyProfile.mockResolvedValue({
        skills: ['TypeScript', 'Node.js'],
      } as any);

      // 1 job with 0.8 similarity, requires TypeScript and Docker (50% skill overlap)
      // Expected skill boost = 0.5 * 0.2 = 0.1
      // Expected final score = (0.8 * 0.8) + 0.1 = 0.64 + 0.1 = 0.74
      jobsRepo.findSimilarJobs.mockResolvedValue([{ id: 'job-1', score: 0.8 }]);

      jobsRepo.findById.mockResolvedValue({
        id: 'job-1',
        title: 'Backend Dev',
        company: 'Corp',
        skillsRequired: ['TypeScript', 'Docker'],
      } as any);

      const result = await service.getMatches('user-1', {}, 1, 10);

      expect(result.data.length).toBe(1);
      expect(result.data[0].finalScore).toBeCloseTo(0.74, 2);
      expect(result.data[0].matchingSkills).toContain('TypeScript');
      expect(result.data[0].missingSkills).toContain('Docker');
      expect(cacheRepo.cacheMatches).toHaveBeenCalledTimes(1);
    });

    it('should return helpful onboarding hint if user has no vector embedding yet', async () => {
      profilesService.getProfileEmbedding.mockResolvedValue(null);

      const result = await service.getMatches('user-new', {}, 1, 10);

      expect(result.data).toEqual([]);
      expect(result['hint']).toBeDefined();
    });
  });

  describe('handleProfileUpdated', () => {
    it('should invalidate cache when user profile is updated', async () => {
      await service.handleProfileUpdated({
        userId: 'user-1',
        updatedFields: ['skills'],
        updatedAt: new Date(),
      });

      expect(cacheRepo.invalidateCache).toHaveBeenCalledWith('user-1');
    });
  });

  describe('getMatchExplanation', () => {
    it('should return deterministic skill and score breakdown without LLM calls', async () => {
      profilesService.getMyProfile.mockResolvedValue({
        skills: ['Python', 'SQL'],
      } as any);

      jobsRepo.findById.mockResolvedValue({
        id: 'job-1',
        title: 'Data Analyst',
        skillsRequired: ['Python', 'SQL', 'Tableau'],
      } as any);

      cacheRepo.getDbMatches.mockResolvedValue([{ jobId: 'job-1', score: 0.85 }]);

      const explanation = await service.getMatchExplanation('user-1', 'job-1');

      expect(explanation.jobId).toBe('job-1');
      expect(explanation.totalJobSkills).toBe(3);
      expect(explanation.matchedSkillCount).toBe(2);
      expect(explanation.matchingSkills).toEqual(['Python', 'SQL']);
      expect(explanation.missingSkills).toEqual(['Tableau']);
      expect(explanation.explanation).toContain('match. You possess 2 of 3 key skills');
    });
  });
});
