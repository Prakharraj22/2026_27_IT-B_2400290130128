import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { SkillTrendsRepository } from '../repositories/skill-trends.repository';
import { SalaryBenchmarksRepository } from '../repositories/salary-benchmarks.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENTS, MarketTrendsUpdatedEvent } from '../../shared/events/event-bus.interface';

@Injectable()
export class AggregationService {
  private readonly logger = new Logger(AggregationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly skillTrendsRepository: SkillTrendsRepository,
    private readonly salaryBenchmarksRepository: SalaryBenchmarksRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async runAggregation(
    periodStart: Date,
    periodEnd: Date,
  ): Promise<{ skillsAggregated: number; benchmarksAggregated: number }> {
    this.logger.log(
      `Running market aggregation: ${periodStart.toISOString().slice(0, 10)} to ${periodEnd.toISOString().slice(0, 10)}`,
    );

    const skillsAggregated = await this.aggregateSkillTrends(periodStart, periodEnd);
    const benchmarksAggregated = await this.aggregateSalaryBenchmarks(periodStart, periodEnd);

    const event: MarketTrendsUpdatedEvent = {
      period: `${periodStart.toISOString().slice(0, 10)} to ${periodEnd.toISOString().slice(0, 10)}`,
      skillsAggregated,
      completedAt: new Date(),
    };
    this.eventEmitter.emit(EVENTS.MARKET_TRENDS_UPDATED, event);

    return { skillsAggregated, benchmarksAggregated };
  }

  private async aggregateSkillTrends(periodStart: Date, periodEnd: Date): Promise<number> {
    const jobs = await this.prisma.job.findMany({
      where: {
        postedAt: { gte: periodStart, lte: periodEnd },
      },
      select: { skillsRequired: true, salaryMin: true, salaryMax: true },
    });

    const skillMap = new Map<string, { count: number; salaries: number[] }>();

    for (const job of jobs) {
      const skills = (job.skillsRequired as string[]) || [];
      const salaryMid =
        job.salaryMin && job.salaryMax ? (job.salaryMin + job.salaryMax) / 2 : null;

      for (const skill of skills) {
        const normalized = skill.trim();
        if (!normalized) continue;
        if (!skillMap.has(normalized)) {
          skillMap.set(normalized, { count: 0, salaries: [] });
        }
        const entry = skillMap.get(normalized)!;
        entry.count++;
        if (salaryMid !== null) entry.salaries.push(salaryMid);
      }
    }

    let aggregated = 0;
    for (const [skillName, data] of skillMap.entries()) {
      const avgSalaryLow =
        data.salaries.length > 0 ? Math.round(Math.min(...data.salaries)) : undefined;
      const avgSalaryHigh =
        data.salaries.length > 0 ? Math.round(Math.max(...data.salaries)) : undefined;

      await this.skillTrendsRepository.upsertTrend({
        skillName,
        demandCount: data.count,
        periodStart,
        periodEnd,
        avgSalaryLow,
        avgSalaryHigh,
      });
      aggregated++;
    }

    this.logger.log(`Aggregated ${aggregated} skill trends`);
    return aggregated;
  }

  private async aggregateSalaryBenchmarks(periodStart: Date, periodEnd: Date): Promise<number> {
    const jobs = await this.prisma.job.findMany({
      where: {
        postedAt: { gte: periodStart, lte: periodEnd },
        salaryMin: { not: null },
        salaryMax: { not: null },
      },
      select: { title: true, location: true, salaryMin: true, salaryMax: true },
    });

    const roleMap = new Map<string, number[]>();
    for (const job of jobs) {
      const role = this.normalizeRole(job.title);
      const loc = job.location || 'global';
      const key = `${role}|${loc}`;
      const mid = (job.salaryMin! + job.salaryMax!) / 2;
      if (!roleMap.has(key)) roleMap.set(key, []);
      roleMap.get(key)!.push(mid);
    }

    const quarter = this.getQuarterLabel(periodStart);
    let aggregated = 0;

    for (const [key, salaries] of roleMap.entries()) {
      const [roleTitle, location] = key.split('|');
      salaries.sort((a, b) => a - b);

      const p25 = this.percentile(salaries, 25);
      const p50 = this.percentile(salaries, 50);
      const p75 = this.percentile(salaries, 75);

      await this.salaryBenchmarksRepository.upsertBenchmark({
        roleTitle,
        location,
        percentile25: Math.round(p25),
        percentile50: Math.round(p50),
        percentile75: Math.round(p75),
        sampleSize: salaries.length,
        period: quarter,
      });
      aggregated++;
    }

    this.logger.log(`Aggregated ${aggregated} salary benchmarks`);
    return aggregated;
  }

  private normalizeRole(title: string): string {
    if (/senior backend|backend/i.test(title)) return 'Backend Engineer';
    if (/frontend/i.test(title)) return 'Frontend Engineer';
    if (/full.?stack/i.test(title)) return 'Full Stack Developer';
    if (/data engineer/i.test(title)) return 'Data Engineer';
    if (/data scientist/i.test(title)) return 'Data Scientist';
    if (/ml engineer|machine learning/i.test(title)) return 'Machine Learning Engineer';
    if (/devops/i.test(title)) return 'DevOps Engineer';
    if (/sre|site reliability/i.test(title)) return 'Site Reliability Engineer';
    if (/platform engineer/i.test(title)) return 'Platform Engineer';
    if (/cloud architect/i.test(title)) return 'Cloud Architect';
    return title.trim();
  }

  private percentile(sorted: number[], p: number): number {
    if (sorted.length === 0) return 0;
    if (sorted.length === 1) return sorted[0];
    const idx = (p / 100) * (sorted.length - 1);
    const lower = Math.floor(idx);
    const upper = Math.ceil(idx);
    if (lower === upper) return sorted[lower];
    return sorted[lower] + (sorted[upper] - sorted[lower]) * (idx - lower);
  }

  private getQuarterLabel(date: Date): string {
    const year = date.getFullYear();
    const quarter = Math.ceil((date.getMonth() + 1) / 3);
    return `${year}-Q${quarter}`;
  }
}
