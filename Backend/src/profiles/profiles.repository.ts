import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/database/prisma.service';
import { Profile } from '@prisma/client';

@Injectable()
export class ProfilesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<Profile | null> {
    return this.prisma.profile.findUnique({ where: { userId } });
  }

  async findById(id: string): Promise<Profile | null> {
    return this.prisma.profile.findUnique({ where: { id } });
  }

  async updateProfile(
    userId: string,
    data: {
      fullName?: string;
      headline?: string;
      location?: string;
      yearsExperience?: number;
      preferences?: Record<string, any>;
    },
  ): Promise<Profile> {
    return this.prisma.profile.update({
      where: { userId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async updateSkills(userId: string, skills: string[]): Promise<Profile> {
    return this.prisma.profile.update({
      where: { userId },
      data: { skills, updatedAt: new Date() },
    });
  }

  async updateEmbedding(userId: string, embedding: number[]): Promise<void> {
    const vectorStr = `[${embedding.join(',')}]`;
    await this.prisma.$executeRawUnsafe(
      `UPDATE auth.profiles SET embedding = $1::vector, updated_at = NOW() WHERE user_id = $2::uuid`,
      vectorStr,
      userId,
    );
  }

  async getProfileEmbedding(userId: string): Promise<number[] | null> {
    const result = await this.prisma.$queryRawUnsafe<Array<{ embedding: string | null }>>(
      `SELECT embedding::text as embedding FROM auth.profiles WHERE user_id = $1::uuid`,
      userId,
    );
    if (!result || result.length === 0 || !result[0]?.embedding) return null;
    const cleaned = result[0].embedding.replace(/[\[\]]/g, '');
    if (!cleaned.trim()) return null;
    return cleaned.split(',').map(Number);
  }
}
