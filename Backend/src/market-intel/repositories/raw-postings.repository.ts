import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { JobPostingRaw } from '@prisma/client';

@Injectable()
export class RawPostingsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Atomic idempotent insert: the DB's unique(source, sourceId) constraint is
  // the source of truth, not a check-then-insert (which has a race window
  // under concurrent ingestion runs — two calls can both see "not existing"
  // and both attempt to create, and the loser used to surface as a hard
  // error instead of being treated as an ordinary duplicate).
  async upsertRaw(data: { source: string; sourceId: string; rawPayload: object }): Promise<{ isNew: boolean; record: JobPostingRaw }> {
    try {
      const record = await this.prisma.jobPostingRaw.create({
        data: {
          source: data.source,
          sourceId: data.sourceId,
          rawPayload: data.rawPayload,
          processed: false,
        },
      });
      return { isNew: true, record };
    } catch (err: any) {
      if (err?.code === 'P2002') {
        const existing = await this.prisma.jobPostingRaw.findUniqueOrThrow({
          where: { source_sourceId: { source: data.source, sourceId: data.sourceId } },
        });
        return { isNew: false, record: existing };
      }
      throw err;
    }
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
