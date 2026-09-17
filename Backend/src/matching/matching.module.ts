import { Module } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { MatchingController } from './matching.controller';
import { JobsRepository } from './jobs.repository';
import { MatchCacheRepository } from './match-cache.repository';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  imports: [ProfilesModule],
  providers: [MatchingService, JobsRepository, MatchCacheRepository],
  controllers: [MatchingController],
  exports: [MatchingService, JobsRepository, MatchCacheRepository],
})
export class MatchingModule {}
