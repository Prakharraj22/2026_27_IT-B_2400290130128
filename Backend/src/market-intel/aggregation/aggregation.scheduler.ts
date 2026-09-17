import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AggregationService } from './aggregation.service';

@Injectable()
export class AggregationScheduler {
  private readonly logger = new Logger(AggregationScheduler.name);

  constructor(private readonly aggregationService: AggregationService) {}

  @Cron('0 3 * * *', { name: 'market-aggregation' })
  async runScheduledAggregation(): Promise<void> {
    this.logger.log('Scheduled market aggregation started');
    try {
      const periodEnd = new Date();
      const periodStart = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      const result = await this.aggregationService.runAggregation(periodStart, periodEnd);
      this.logger.log(`Scheduled market aggregation completed: ${JSON.stringify(result)}`);
    } catch (err) {
      this.logger.error(`Scheduled market aggregation failed: ${err.message}`);
    }
  }

  async triggerNow(
    periodStart?: Date,
    periodEnd?: Date,
  ): Promise<{ skillsAggregated: number; benchmarksAggregated: number }> {
    const end = periodEnd || new Date();
    const start = periodStart || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    return this.aggregationService.runAggregation(start, end);
  }
}
