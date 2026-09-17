import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../shared/database/prisma.service';
import { RedisService } from '../shared/redis/redis.service';
import { ConfigService } from '@nestjs/config';

export interface CachedMatch {
  jobId: string;
  score: number;
}

@Injectable()
export class MatchCacheRepository {
  private readonly logger = new Logger(MatchCacheRepository.name);
  private readonly cacheTtl: number;
  private readonly CACHE_KEY_PREFIX = 'match';

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly configService: ConfigService,
  ) {
    this.cacheTtl = this.configService.get<number>('cache.ttl') || 3600;
  }

  private getCacheKey(userId: string): string {
    return `${this.CACHE_KEY_PREFIX}:${userId}:scores`;
  }

  async getCachedMatches(userId: string): Promise<CachedMatch[] | null> {
    try {
      const key = this.getCacheKey(userId);
      const exists = await this.redis.exists(key);
      if (!exists) return null;

      const raw = await this.redis.zrevrange(key, 0, -1, true);
      if (!raw || raw.length === 0) return null;

      const matches: CachedMatch[] = [];
      for (let i = 0; i < raw.length; i += 2) {
        matches.push({ jobId: raw[i], score: parseFloat(raw[i + 1]) });
      }
      return matches;
    } catch (err) {
      this.logger.warn(`Redis getCachedMatches failed: ${err.message}`);
      return null;
    }
  }

  async cacheMatches(userId: string, matches: CachedMatch[]): Promise<void> {
    const key = this.getCacheKey(userId);
    try {
      for (const m of matches) {
        await this.redis.zadd(key, m.score, m.jobId);
      }
      await this.redis.expire(key, this.cacheTtl);
    } catch (err) {
      this.logger.warn(`Redis cacheMatches failed: ${err.message}`);
    }

    if (matches.length > 0) {
      try {
        await this.prisma.$transaction(
          matches.map((m) =>
            this.prisma.matchCache.upsert({
              where: { userId_jobId: { userId, jobId: m.jobId } },
              update: { score: m.score, computedAt: new Date() },
              create: { userId, jobId: m.jobId, score: m.score },
            }),
          ),
        );
      } catch (err) {
        this.logger.warn(`Postgres match_cache persistence warning: ${err.message}`);
      }
    }
  }

  async invalidateCache(userId: string): Promise<void> {
    try {
      const key = this.getCacheKey(userId);
      await this.redis.del(key);
    } catch (err) {
      this.logger.warn(`Redis invalidateCache failed: ${err.message}`);
    }

    try {
      await this.prisma.matchCache.deleteMany({ where: { userId } });
    } catch (err) {
      this.logger.warn(`Postgres match_cache invalidation warning: ${err.message}`);
    }
  }

  async getDbMatches(userId: string): Promise<CachedMatch[]> {
    try {
      const rows = await this.prisma.matchCache.findMany({
        where: { userId },
        orderBy: { score: 'desc' },
      });
      return rows.map((r) => ({ jobId: r.jobId, score: r.score }));
    } catch {
      return [];
    }
  }
}
