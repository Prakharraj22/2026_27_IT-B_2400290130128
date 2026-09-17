import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProfilesService } from '../../src/profiles/profiles.service';
import { ProfilesRepository } from '../../src/profiles/profiles.repository';
import { AuthRepository } from '../../src/auth/auth.repository';
import { EVENTS } from '../../src/shared/events/event-bus.interface';

describe('ProfilesService (Unit Tests)', () => {
  let service: ProfilesService;
  let profilesRepo: jest.Mocked<ProfilesRepository>;
  let authRepo: jest.Mocked<AuthRepository>;
  let eventEmitter: jest.Mocked<EventEmitter2>;

  beforeEach(async () => {
    const mockProfilesRepo = {
      findByUserId: jest.fn(),
      findById: jest.fn(),
      updateProfile: jest.fn(),
      updateSkills: jest.fn(),
      updateEmbedding: jest.fn(),
      getProfileEmbedding: jest.fn(),
    };

    const mockAuthRepo = {
      findUserById: jest.fn(),
    };

    const mockEventEmitter = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        { provide: ProfilesRepository, useValue: mockProfilesRepo },
        { provide: AuthRepository, useValue: mockAuthRepo },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);
    profilesRepo = module.get(ProfilesRepository);
    authRepo = module.get(AuthRepository);
    eventEmitter = module.get(EventEmitter2);
  });

  describe('updateProfile', () => {
    it('should reject update if skills field is directly provided', async () => {
      await expect(
        service.updateProfile('user-1', {}, { skills: ['Hacking'] }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should update permitted fields and emit user.profile.updated event', async () => {
      profilesRepo.findByUserId.mockResolvedValue({
        id: 'prof-1',
        userId: 'user-1',
        skills: ['TypeScript'],
        preferences: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      profilesRepo.updateProfile.mockResolvedValue({
        id: 'prof-1',
        userId: 'user-1',
        fullName: 'Jane Doe',
        headline: 'Lead Architect',
        skills: ['TypeScript'],
        preferences: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const res = await service.updateProfile(
        'user-1',
        { fullName: 'Jane Doe', headline: 'Lead Architect' },
        {},
      );

      expect(res.fullName).toBe('Jane Doe');
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        EVENTS.USER_PROFILE_UPDATED,
        expect.objectContaining({ userId: 'user-1' }),
      );
    });
  });

  describe('getPublicProfile', () => {
    it('should sanitize public view and omit email and preferences', async () => {
      profilesRepo.findById.mockResolvedValue({
        id: 'prof-1',
        userId: 'user-1',
        fullName: 'Public Jane',
        headline: 'Engineer',
        location: 'Remote',
        yearsExperience: 5,
        skills: ['Node.js', 'PostgreSQL'],
        preferences: { minSalary: 120000 },
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const publicProfile = await service.getPublicProfile('prof-1');

      expect(publicProfile.id).toBe('prof-1');
      expect(publicProfile.fullName).toBe('Public Jane');
      expect((publicProfile as any).email).toBeUndefined();
      expect((publicProfile as any).preferences).toBeUndefined();
    });
  });
});
