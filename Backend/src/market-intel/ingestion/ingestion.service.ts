import { Injectable, Inject, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IJobFetcher, JOB_FETCHER } from './job-fetcher.interface';
import { RawPostingsRepository } from '../repositories/raw-postings.repository';
import { JobsRepository } from '../../matching/jobs.repository';
import { EVENTS, MarketIngestionCompletedEvent } from '../../shared/events/event-bus.interface';

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);
  private readonly MAX_RETRIES = 3;

  constructor(
    @Inject(JOB_FETCHER) private readonly fetcher: IJobFetcher,
    private readonly rawPostingsRepository: RawPostingsRepository,
    private readonly jobsRepository: JobsRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async runIngestion(): Promise<{ ingested: number; skipped: number; errors: number }> {
    this.logger.warn(`⚠️  Ingestion pipeline running with data source: ${this.fetcher.sourceName}`);

    let ingested = 0;
    let skipped = 0;
    let errors = 0;

    let rawJobs: any[] = [];
    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        rawJobs = await this.fetcher.fetch();
        break;
      } catch (err) {
        this.logger.error(`Fetch attempt ${attempt}/${this.MAX_RETRIES} failed: ${err.message}`);
        if (attempt === this.MAX_RETRIES) {
          this.logger.error('Max fetch retries reached. Aborting ingestion batch.');
          return { ingested: 0, skipped: 0, errors: 1 };
        }
        await new Promise((res) => setTimeout(res, Math.pow(2, attempt - 1) * 1000));
      }
    }

    for (const rawJob of rawJobs) {
      try {
        if (!rawJob.sourceId || !rawJob.title || !rawJob.company) {
          skipped++;
          continue;
        }

        const { isNew, record } = await this.rawPostingsRepository.upsertRaw({
          source: this.fetcher.sourceName,
          sourceId: rawJob.sourceId,
          rawPayload: rawJob,
        });

        if (!isNew) {
          skipped++;
          continue;
        }

        await this.jobsRepository.upsertJob({
          title: rawJob.title,
          company: rawJob.company,
          description: rawJob.description,
          location: rawJob.location,
          remote: rawJob.remote ?? false,
          salaryMin: rawJob.salaryMin,
          salaryMax: rawJob.salaryMax,
          skillsRequired: rawJob.skills ?? [],
          source: this.fetcher.sourceName,
          sourceId: rawJob.sourceId,
          postedAt: rawJob.postedAt ? new Date(rawJob.postedAt) : undefined,
        });

        await this.rawPostingsRepository.markProcessed(record.id);
        ingested++;
      } catch (err) {
        this.logger.error(`Error processing raw job ${rawJob.sourceId}: ${err.message}`);
        errors++;
      }
    }

    const event: MarketIngestionCompletedEvent = {
      jobsIngested: ingested,
      source: this.fetcher.sourceName,
      completedAt: new Date(),
    };
    this.eventEmitter.emit(EVENTS.MARKET_INGESTION_COMPLETED, event);

    this.logger.log(`Ingestion completed: ${ingested} added, ${skipped} skipped, ${errors} errors`);
    return { ingested, skipped, errors };
  }
}
