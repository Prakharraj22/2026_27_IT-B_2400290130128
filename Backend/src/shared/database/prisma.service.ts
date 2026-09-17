import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'warn' },
      ],
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      this.logger.log('Database connection established');
    } catch (error) {
      this.logger.error('Failed to connect to database', error.message);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('Database connection closed');
  }

  async isHealthy(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }

  async cleanDatabase(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('cleanDatabase() can only be called in test environment');
    }
    // Truncate in FK-safe order
    await this.$executeRaw`TRUNCATE TABLE matching.match_cache CASCADE`;
    await this.$executeRaw`TRUNCATE TABLE market_intel.skill_trends CASCADE`;
    await this.$executeRaw`TRUNCATE TABLE market_intel.salary_benchmarks CASCADE`;
    await this.$executeRaw`TRUNCATE TABLE market_intel.job_postings_raw CASCADE`;
    await this.$executeRaw`TRUNCATE TABLE matching.jobs CASCADE`;
    await this.$executeRaw`TRUNCATE TABLE auth.refresh_tokens CASCADE`;
    await this.$executeRaw`TRUNCATE TABLE auth.profiles CASCADE`;
    await this.$executeRaw`TRUNCATE TABLE auth.users CASCADE`;
  }
}
