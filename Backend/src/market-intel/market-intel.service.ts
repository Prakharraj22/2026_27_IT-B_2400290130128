import { Injectable } from '@nestjs/common';
import { SkillTrendsRepository } from './repositories/skill-trends.repository';
import { SalaryBenchmarksRepository } from './repositories/salary-benchmarks.repository';
import { SkillTrendQueryDto, SalaryBenchmarkQueryDto } from './dto/market-query.dto';

const DATA_DISCLAIMER =
  '⚠️ Synthetic data — illustrative only. NOT real market data. Do not use for financial or hiring decisions.';
const DATA_SOURCE = 'synthetic-mock';

@Injectable()
export class MarketIntelService {
  constructor(
    private readonly skillTrendsRepository: SkillTrendsRepository,
    private readonly salaryBenchmarksRepository: SalaryBenchmarksRepository,
  ) {}

  async getSkillTrends(query: SkillTrendQueryDto) {
    const periodStart = query.periodStart
      ? new Date(query.periodStart)
      : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const periodEnd = query.periodEnd ? new Date(query.periodEnd) : new Date();

    const data = await this.skillTrendsRepository.findMany({
      periodStart,
      periodEnd,
      limit: query.limit,
    });

    return {
      data,
      period: {
        start: periodStart.toISOString().slice(0, 10),
        end: periodEnd.toISOString().slice(0, 10),
      },
      dataSource: DATA_SOURCE,
      disclaimer: DATA_DISCLAIMER,
    };
  }

  async getSalaryBenchmarks(query: SalaryBenchmarkQueryDto) {
    const data = await this.salaryBenchmarksRepository.findMany({
      roleTitle: query.roleTitle,
      location: query.location,
      period: query.period,
    });

    return {
      data,
      dataSource: DATA_SOURCE,
      disclaimer: DATA_DISCLAIMER,
    };
  }

  async getOverview() {
    const periodEnd = new Date();
    const periodStart = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

    const [topSkills, salaryStats] = await Promise.all([
      this.skillTrendsRepository.findTopByPeriod(periodStart, periodEnd, 10),
      this.salaryBenchmarksRepository.findMany({}),
    ]);

    const headlineSalaryStats = salaryStats.slice(0, 5).map((b) => ({
      roleTitle: b.roleTitle,
      location: b.location,
      median: b.percentile50,
      low: b.percentile25,
      high: b.percentile75,
      sampleSize: b.sampleSize,
    }));

    return {
      topSkills,
      headlineSalaryStats,
      postingVolumeTrend: [
        {
          period: `${periodStart.toISOString().slice(0, 10)} to ${periodEnd.toISOString().slice(0, 10)}`,
          volume: topSkills.reduce((sum, t) => sum + t.demandCount, 0),
        },
      ],
      generatedAt: new Date().toISOString(),
      dataSource: DATA_SOURCE,
      disclaimer: DATA_DISCLAIMER,
    };
  }
}
