import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProfilesRepository } from './profiles.repository';
import { AuthRepository } from '../auth/auth.repository';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { EVENTS, UserProfileUpdatedEvent } from '../shared/events/event-bus.interface';
import { ProfileSkillsUpdater } from '../shared/interfaces/profile-skills-update.interface';

@Injectable()
export class ProfilesService implements ProfileSkillsUpdater {
  constructor(
    private readonly profilesRepository: ProfilesRepository,
    private readonly authRepository: AuthRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getMyProfile(userId: string) {
    const profile = await this.profilesRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException({ code: 'PROFILE_NOT_FOUND', message: 'Profile not found' });
    }
    const user = await this.authRepository.findUserById(userId);
    return {
      id: profile.id,
      userId: profile.userId,
      email: user?.email,
      fullName: profile.fullName,
      headline: profile.headline,
      location: profile.location,
      yearsExperience: profile.yearsExperience,
      skills: (profile.skills as string[]) || [],
      preferences: (profile.preferences as Record<string, any>) || {},
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }

  async getPublicProfile(profileId: string) {
    const profile = await this.profilesRepository.findById(profileId);
    if (!profile) {
      throw new NotFoundException({ code: 'PROFILE_NOT_FOUND', message: 'Profile not found' });
    }
    return {
      id: profile.id,
      fullName: profile.fullName,
      headline: profile.headline,
      location: profile.location,
      yearsExperience: profile.yearsExperience,
      skills: (profile.skills as string[]) || [],
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto, rawBody: Record<string, any>) {
    if ('skills' in rawBody) {
      throw new BadRequestException({
        code: 'SKILLS_FIELD_PROTECTED',
        message: 'The skills field is managed by the Resume Module and cannot be updated directly.',
        details: { field: 'skills' },
      });
    }

    const profile = await this.profilesRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException({ code: 'PROFILE_NOT_FOUND', message: 'Profile not found' });
    }

    const updatedProfile = await this.profilesRepository.updateProfile(userId, dto);

    const updatedFields = Object.keys(dto).filter((k) => dto[k] !== undefined);
    if (updatedFields.length > 0) {
      const event: UserProfileUpdatedEvent = {
        userId,
        updatedFields,
        updatedAt: updatedProfile.updatedAt,
      };
      this.eventEmitter.emit(EVENTS.USER_PROFILE_UPDATED, event);
    }

    return {
      id: updatedProfile.id,
      userId: updatedProfile.userId,
      fullName: updatedProfile.fullName,
      headline: updatedProfile.headline,
      location: updatedProfile.location,
      yearsExperience: updatedProfile.yearsExperience,
      skills: (updatedProfile.skills as string[]) || [],
      preferences: (updatedProfile.preferences as Record<string, any>) || {},
      createdAt: updatedProfile.createdAt,
      updatedAt: updatedProfile.updatedAt,
    };
  }

  async updateSkills(userId: string, skills: string[]): Promise<void> {
    const profile = await this.profilesRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundException({ code: 'PROFILE_NOT_FOUND', message: 'Profile not found' });
    }
    await this.profilesRepository.updateSkills(userId, skills);

    const event: UserProfileUpdatedEvent = {
      userId,
      updatedFields: ['skills'],
      updatedAt: new Date(),
    };
    this.eventEmitter.emit(EVENTS.USER_PROFILE_UPDATED, event);
  }

  async updateEmbedding(userId: string, embedding: number[]): Promise<void> {
    await this.profilesRepository.updateEmbedding(userId, embedding);
    const event: UserProfileUpdatedEvent = {
      userId,
      updatedFields: ['embedding'],
      updatedAt: new Date(),
    };
    this.eventEmitter.emit(EVENTS.USER_PROFILE_UPDATED, event);
  }

  async getProfileEmbedding(userId: string): Promise<number[] | null> {
    return this.profilesRepository.getProfileEmbedding(userId);
  }
}
