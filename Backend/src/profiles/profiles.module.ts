import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { ProfilesRepository } from './profiles.repository';
import { AuthModule } from '../auth/auth.module';
import { PROFILE_SKILLS_UPDATER } from '../shared/interfaces/profile-skills-update.interface';

@Module({
  imports: [AuthModule],
  providers: [
    ProfilesService,
    ProfilesRepository,
    {
      provide: PROFILE_SKILLS_UPDATER,
      useExisting: ProfilesService,
    },
  ],
  controllers: [ProfilesController],
  exports: [ProfilesService, ProfilesRepository, PROFILE_SKILLS_UPDATER],
})
export class ProfilesModule {}
