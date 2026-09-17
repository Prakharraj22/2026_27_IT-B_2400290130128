import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/database/prisma.service';
import { Job } from '@prisma/client';
import { paginate, getPaginationParams } from '../shared/utils/pagination';

export interface JobFilters {
  search?: string;
  location?: string;
  remote?: boolean;
  salaryMin?: number;
  salaryMax?: number;
}

@Injectable()
export class JobsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Job | null> {
    return this.prisma.job.findUnique({ where: { id } });
  }

  async findMany(filters: JobFilters, page: number, limit: number) {
    const { skip, take } = getPaginationParams(page, limit);

    const where: any = {};
    if (filters.remote !== undefined) where.remote = filters.remote;
    if (filters.location) where.location = { contains: filters.location, mode: 'insensitive' };
    if (filters.salaryMin !== undefined) where.salaryMax = { gte: filters.salaryMin };
    if (filters.salaryMax !== undefined) {
      where.salaryMin = { ...where.salaryMin, lte: filters.salaryMax };
    }
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { company: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.job.findMany({ where, skip, take, orderBy: { postedAt: 'desc' } }),
      this.prisma.job.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }

  async upsertJob(data: {
    title: string;
    company: string;
    description?: string;
    location?: string;
    remote?: boolean;
    salaryMin?: number;
    salaryMax?: number;
    skillsRequired?: string[];
    source: string;
    sourceId: string;
    postedAt?: Date;
  }): Promise<Job> {
    return this.prisma.job.upsert({
      where: { source_sourceId: { source: data.source, sourceId: data.sourceId } },
      update: {
        title: data.title,
        company: data.company,
        description: data.description,
        location: data.location,
        remote: data.remote ?? false,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        skillsRequired: data.skillsRequired ?? [],
        postedAt: data.postedAt,
        updatedAt: new Date(),
      },
      create: {
        title: data.title,
        company: data.company,
        description: data.description,
        location: data.location,
        remote: data.remote ?? false,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        skillsRequired: data.skillsRequired ?? [],
        source: data.source,
        sourceId: data.sourceId,
        postedAt: data.postedAt,
      },
    });
  }

  async updateEmbedding(jobId: string, embedding: number[]): Promise<void> {
    const vectorStr = `[${embedding.join(',')}]`;
    await this.prisma.$executeRawUnsafe(
      `UPDATE matching.jobs SET embedding = $1::vector, updated_at = NOW() WHERE id = $2::uuid`,
      vectorStr,
      jobId,
    );
  }

  async findSimilarJobs(
    profileEmbedding: number[],
    filters: JobFilters,
    limit: number,
  ): Promise<Array<{ id: string; score: number }>> {
    const vectorStr = `[${profileEmbedding.join(',')}]`;

    const conditions: string[] = ['j.embedding IS NOT NULL'];
    const params: any[] = [vectorStr];
    let paramIdx = 2;

    if (filters.remote !== undefined) {
      conditions.push(`j.remote = $${paramIdx}`);
      params.push(filters.remote);
      paramIdx++;
    }
    if (filters.location) {
      conditions.push(`j.location ILIKE $${paramIdx}`);
      params.push(`%${filters.location}%`);
      paramIdx++;
    }
    if (filters.salaryMin !== undefined) {
      conditions.push(`(j.salary_max IS NULL OR j.salary_max >= $${paramIdx})`);
      params.push(filters.salaryMin);
      paramIdx++;
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;
    params.push(Math.max(limit, 10));

    try {
      const results = await this.prisma.$queryRawUnsafe<Array<{ id: string; distance: number }>>(
        `SELECT j.id, (j.embedding <=> $1::vector) as distance
         FROM matching.jobs j
         ${whereClause}
         ORDER BY j.embedding <=> $1::vector ASC
         LIMIT $${paramIdx}`,
        ...params,
      );

      return results.map((r) => ({
        id: r.id,
        score: Math.max(0, 1 - (r.distance ?? 1)),
      }));
    } catch {
      // Fallback if pgvector table is empty or vector extension not yet enabled in dev/test
      const fallbackJobs = await this.prisma.job.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
      });
      return fallbackJobs.map((j) => ({ id: j.id, score: 0.5 }));
    }
  }
}
