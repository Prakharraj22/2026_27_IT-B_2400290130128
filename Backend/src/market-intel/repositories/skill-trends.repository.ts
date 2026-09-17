import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { SkillTrend } from '@prisma/client';

@Injectable()
export class SkillTrendsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsertTrend(data: {
    skillName: string;
    demandCount: number;
    periodStart: Date;
    periodEnd: Date;
    avgSalaryLow?: number;
    avgSalaryHigh?: number;
  }): Promise<SkillTrend> {
    return this.prisma.skillTrend.upsert({
      where: {
        skillName_periodStart_periodEnd: {
          skillName: data.skillName,
          periodStart: data.periodStart,
          periodEnd: data.periodEnd,
        },
      },
      update: {
        demandCount: data.demandCount,
        avgSalaryLow: data.avgSalaryLow,
        avgSalaryHigh: data.avgSalaryHigh,
      },
      create: data,
    });
  }

  async findMany(filters: { periodStart?: Date; periodEnd?: Date; limit?: number }): Promise<SkillTrend[]> {
    const where: any = {};
    if (filters.periodStart) where.periodStart = { gte: filters.periodStart };
    if (filters.periodEnd) where.periodEnd = { lte: filters.periodEnd };

    return this.prisma.skillTrend.findMany({
      where,
      take: filters.limit || 20,
      orderBy: { demandCount: 'desc' },
    });
  }

  async findTopByPeriod(periodStart: Date, periodEnd: Date, limit: number): Promise<SkillTrend[]> {
    return this.prisma.skillTrend.findMany({
      where: {
        periodStart: { gte: periodStart },
        periodEnd: { lte: periodEnd },
      },
      take: limit,
      orderBy: { demandCount: 'desc' },
    });
  }
}
