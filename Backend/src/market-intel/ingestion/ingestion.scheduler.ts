import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { IngestionService } from './ingestion.service';

@Injectable()
export class IngestionScheduler {
  private readonly logger = new Logger(IngestionScheduler.name);

  constructor(private readonly ingestionService: IngestionService) {}

  @Cron('0 2 * * *', { name: 'market-ingestion' })
  async runScheduledIngestion(): Promise<void> {
    this.logger.log('Scheduled market ingestion started');
    try {
      const result = await this.ingestionService.runIngestion();
      this.logger.log(`Scheduled market ingestion finished: ${JSON.stringify(result)}`);
    } catch (err) {
      this.logger.error(`Scheduled market ingestion failed: ${err.message}`);
    }
  }

  async triggerNow(): Promise<{ ingested: number; skipped: number; errors: number }> {
    return this.ingestionService.runIngestion();
  }
}
