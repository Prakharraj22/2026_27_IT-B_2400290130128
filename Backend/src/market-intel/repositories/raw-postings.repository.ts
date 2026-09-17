import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { JobPostingRaw } from '@prisma/client';

@Injectable()
export class RawPostingsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsertRaw(data: { source: string; sourceId: string; rawPayload: object }): Promise<{ isNew: boolean; record: JobPostingRaw }> {
    const existing = await this.prisma.jobPostingRaw.findUnique({
      where: { source_sourceId: { source: data.source, sourceId: data.sourceId } },
    });
    if (existing) return { isNew: false, record: existing };

    const record = await this.prisma.jobPostingRaw.create({
      data: {
        source: data.source,
        sourceId: data.sourceId,
        rawPayload: data.rawPayload,
        processed: false,
      },
    });
    return { isNew: true, record };
  }

  async markProcessed(id: string): Promise<void> {
    await this.prisma.jobPostingRaw.update({
      where: { id },
      data: { processed: true },
    });
  }

  async findUnprocessed(limit = 100): Promise<JobPostingRaw[]> {
    return this.prisma.jobPostingRaw.findMany({
      where: { processed: false },
      take: limit,
      orderBy: { ingestedAt: 'asc' },
    });
  }

  async countBySource(source: string): Promise<number> {
    return this.prisma.jobPostingRaw.count({ where: { source } });
  }
}
