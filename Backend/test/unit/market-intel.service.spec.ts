import { Test, TestingModule } from '@nestjs/testing';
import { MarketIntelService } from '../../src/market-intel/market-intel.service';
import { SkillTrendsRepository } from '../../src/market-intel/repositories/skill-trends.repository';
import { SalaryBenchmarksRepository } from '../../src/market-intel/repositories/salary-benchmarks.repository';

describe('MarketIntelService (Unit Tests)', () => {
  let service: MarketIntelService;
  let skillRepo: jest.Mocked<SkillTrendsRepository>;
  let salaryRepo: jest.Mocked<SalaryBenchmarksRepository>;

  beforeEach(async () => {
    const mockSkillRepo = {
      findMany: jest.fn(),
      findTopByPeriod: jest.fn(),
    };

    const mockSalaryRepo = {
      findMany: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketIntelService,
        { provide: SkillTrendsRepository, useValue: mockSkillRepo },
        { provide: SalaryBenchmarksRepository, useValue: mockSalaryRepo },
      ],
    }).compile();

    service = module.get<MarketIntelService>(MarketIntelService);
    skillRepo = module.get(SkillTrendsRepository);
    salaryRepo = module.get(SalaryBenchmarksRepository);
  });

  describe('getSkillTrends', () => {
    it('should return skill trends with disclaimer and synthetic source note', async () => {
      skillRepo.findMany.mockResolvedValue([
        {
          id: 'trend-1',
          skillName: 'TypeScript',
          demandCount: 450,
          periodStart: new Date('2024-01-01'),
          periodEnd: new Date('2024-03-31'),
          avgSalaryLow: 120000,
          avgSalaryHigh: 175000,
          createdAt: new Date(),
        },
      ]);

      const result = await service.getSkillTrends({});

      expect(result.data.length).toBe(1);
      expect(result.data[0].skillName).toBe('TypeScript');
      expect(result.dataSource).toBe('synthetic-mock');
      expect(result.disclaimer).toContain('Synthetic data');
    });
  });

  describe('getOverview', () => {
    it('should return consolidated dashboard payload with top skills and salary metrics', async () => {
      skillRepo.findTopByPeriod.mockResolvedValue([
        { skillName: 'Python', demandCount: 500 } as any,
      ]);

      salaryRepo.findMany.mockResolvedValue([
        {
          roleTitle: 'Backend Engineer',
          location: 'global',
          percentile25: 110000,
          percentile50: 140000,
          percentile75: 175000,
          sampleSize: 30,
        } as any,
      ]);

      const overview = await service.getOverview();

      expect(overview.topSkills).toHaveLength(1);
      expect(overview.headlineSalaryStats).toHaveLength(1);
      expect(overview.headlineSalaryStats[0].median).toBe(140000);
      expect(overview.dataSource).toBe('synthetic-mock');
      expect(overview.generatedAt).toBeDefined();
    });
  });
});
