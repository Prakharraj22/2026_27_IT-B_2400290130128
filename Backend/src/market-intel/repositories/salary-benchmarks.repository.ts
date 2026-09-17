import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { SalaryBenchmark } from '@prisma/client';

@Injectable()
export class SalaryBenchmarksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsertBenchmark(data: {
    roleTitle: string;
    location: string;
    percentile25?: number;
    percentile50?: number;
    percentile75?: number;
    sampleSize: number;
    period: string;
  }): Promise<SalaryBenchmark> {
    return this.prisma.salaryBenchmark.upsert({
      where: {
        roleTitle_location_period: {
          roleTitle: data.roleTitle,
          location: data.location,
          period: data.period,
        },
      },
      update: {
        percentile25: data.percentile25,
        percentile50: data.percentile50,
        percentile75: data.percentile75,
        sampleSize: data.sampleSize,
      },
      create: data,
    });
  }

  async findMany(filters: { roleTitle?: string; location?: string; period?: string }): Promise<SalaryBenchmark[]> {
    const where: any = {};
    if (filters.roleTitle) where.roleTitle = { contains: filters.roleTitle, mode: 'insensitive' };
    if (filters.location) where.location = { contains: filters.location, mode: 'insensitive' };
    if (filters.period) where.period = filters.period;

    return this.prisma.salaryBenchmark.findMany({ where, orderBy: { roleTitle: 'asc' } });
  }
}
