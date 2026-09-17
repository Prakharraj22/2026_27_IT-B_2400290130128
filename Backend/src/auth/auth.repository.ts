import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/database/prisma.service';
import { User, RefreshToken } from '@prisma/client';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  }

  async findUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async createUser(data: { email: string; passwordHash: string }): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash: data.passwordHash,
        role: 'user',
        isActive: true,
        profile: {
          create: { skills: [], preferences: {} },
        },
      },
    });
  }

  async storeRefreshToken(data: {
    userId: string;
    tokenHash: string;
    familyId: string;
    expiresAt: Date;
  }): Promise<RefreshToken> {
    return this.prisma.refreshToken.create({ data });
  }

  async findRefreshToken(tokenHash: string): Promise<RefreshToken | null> {
    return this.prisma.refreshToken.findUnique({ where: { tokenHash } });
  }

  async revokeRefreshToken(tokenHash: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash },
      data: { revoked: true },
    });
  }

  async revokeTokenFamily(familyId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { familyId },
      data: { revoked: true },
    });
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId },
      data: { revoked: true },
    });
  }

  /**
   * Atomic rotation: revoke old token and insert new one in a single transaction.
   * Prevents race conditions where two concurrent refresh requests both succeed.
   */
  async rotateRefreshToken(
    oldTokenHash: string,
    newData: { userId: string; tokenHash: string; familyId: string; expiresAt: Date },
  ): Promise<RefreshToken> {
    return this.prisma.$transaction(async (tx) => {
      await tx.refreshToken.update({
        where: { tokenHash: oldTokenHash },
        data: { revoked: true },
      });
      return tx.refreshToken.create({ data: newData });
    });
  }

  async deleteExpiredTokens(): Promise<number> {
    const result = await this.prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
    return result.count;
  }
}
