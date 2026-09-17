import { Module } from '@nestjs/common';
import { MarketIntelService } from './market-intel.service';
import { MarketIntelController } from './market-intel.controller';
import { IngestionService } from './ingestion/ingestion.service';
import { IngestionScheduler } from './ingestion/ingestion.scheduler';
import { AggregationService } from './aggregation/aggregation.service';
import { AggregationScheduler } from './aggregation/aggregation.scheduler';
import { MockJobFetcher } from './ingestion/mock-job-fetcher';
import { RawPostingsRepository } from './repositories/raw-postings.repository';
import { SkillTrendsRepository } from './repositories/skill-trends.repository';
import { SalaryBenchmarksRepository } from './repositories/salary-benchmarks.repository';
import { MatchingModule } from '../matching/matching.module';
import { JOB_FETCHER } from './ingestion/job-fetcher.interface';

@Module({
  imports: [MatchingModule],
  providers: [
    MarketIntelService,
    IngestionService,
    IngestionScheduler,
    AggregationService,
    AggregationScheduler,
    RawPostingsRepository,
    SkillTrendsRepository,
    SalaryBenchmarksRepository,
    MockJobFetcher,
    {
      provide: JOB_FETCHER,
      useExisting: MockJobFetcher,
    },
  ],
  controllers: [MarketIntelController],
  exports: [
    MarketIntelService,
    IngestionService,
    IngestionScheduler,
    AggregationService,
    AggregationScheduler,
    RawPostingsRepository,
    SkillTrendsRepository,
    SalaryBenchmarksRepository,
    JOB_FETCHER,
  ],
})
export class MarketIntelModule {}
