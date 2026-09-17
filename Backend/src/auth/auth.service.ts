import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import { AuthRepository } from './auth.repository';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { hashToken, generateSecureToken } from '../shared/utils/hash';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface JwtPayload {
  /** User ID */
  sub: string;
  /** User role ('user' | 'admin') */
  role: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly argon2Options: argon2.Options;

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.argon2Options = {
      type: argon2.argon2id,
      memoryCost: this.configService.get<number>('argon2.memoryCost') ?? 19456,
      timeCost: this.configService.get<number>('argon2.timeCost') ?? 2,
      parallelism: this.configService.get<number>('argon2.parallelism') ?? 1,
    };
  }

  async register(
    dto: RegisterDto,
  ): Promise<{ id: string; email: string; role: string; createdAt: Date }> {
    const existing = await this.authRepository.findUserByEmail(dto.email);
    if (existing) {
      throw new ConflictException({
        code: 'EMAIL_ALREADY_REGISTERED',
        message: 'An account with this email already exists',
      });
    }

    const passwordHash = await argon2.hash(dto.password, this.argon2Options);
    const user = await this.authRepository.createUser({ email: dto.email, passwordHash });

    this.logger.log(`New user registered: ${user.id}`);
    return { id: user.id, email: user.email, role: user.role, createdAt: user.createdAt };
  }

  async login(dto: LoginDto): Promise<TokenPair> {
    const user = await this.authRepository.findUserByEmail(dto.email);

    // Run argon2.verify even when user is not found (dummy hash) to prevent
    // timing-based user enumeration attacks.
    const dummyHash =
      '$argon2id$v=19$m=19456,t=2,p=1$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
    const hashToVerify = user?.passwordHash ?? dummyHash;

    let passwordValid = false;
    try {
      passwordValid = await argon2.verify(hashToVerify, dto.password);
    } catch {
      passwordValid = false;
    }

    if (!user || !passwordValid || !user.isActive) {
      // Same message for wrong email OR wrong password — never reveal which
      throw new UnauthorizedException({
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
      });
    }

    this.logger.log(`User logged in: ${user.id}`);
    return this.issueTokenPair(user.id, user.role);
  }

  async refresh(rawRefreshToken: string): Promise<{ accessToken: string; expiresIn: number }> {
    const tokenHash = hashToken(rawRefreshToken);
    const stored = await this.authRepository.findRefreshToken(tokenHash);

    if (!stored) {
      throw new UnauthorizedException({
        code: 'INVALID_REFRESH_TOKEN',
        message: 'Invalid or expired refresh token',
      });
    }

    // Refresh token reuse detection — if already revoked, revoke entire family
    if (stored.revoked) {
      this.logger.warn(
        `Refresh token reuse detected for family ${stored.familyId} — revoking all sessions`,
      );
      await this.authRepository.revokeTokenFamily(stored.familyId);
      throw new UnauthorizedException({
        code: 'REFRESH_TOKEN_REUSED',
        message: 'Invalid or expired refresh token',
      });
    }

    if (new Date() > stored.expiresAt) {
      await this.authRepository.revokeRefreshToken(tokenHash);
      throw new UnauthorizedException({
        code: 'REFRESH_TOKEN_EXPIRED',
        message: 'Invalid or expired refresh token',
      });
    }

    const user = await this.authRepository.findUserById(stored.userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException({
        code: 'USER_NOT_ACTIVE',
        message: 'Invalid or expired refresh token',
      });
    }

    // Atomic rotation: revoke old, issue new (same family for tracking)
    const newRawToken = generateSecureToken();
    const newTokenHash = hashToken(newRawToken);
    const expiresAt = this.parseExpiry(
      this.configService.get<string>('jwt.refreshExpiresIn') ?? '7d',
    );

    await this.authRepository.rotateRefreshToken(tokenHash, {
      userId: stored.userId,
      tokenHash: newTokenHash,
      familyId: stored.familyId,
      expiresAt,
    });

    const accessToken = this.signAccessToken(user.id, user.role);
    return { accessToken, expiresIn: 900 };
  }

  async logout(userId: string, rawRefreshToken: string): Promise<void> {
    const tokenHash = hashToken(rawRefreshToken);
    const stored = await this.authRepository.findRefreshToken(tokenHash);
    if (stored && stored.userId === userId) {
      await this.authRepository.revokeRefreshToken(tokenHash);
    }
    this.logger.log(`User logged out: ${userId}`);
  }

  async validateUser(userId: string): Promise<{ id: string; role: string } | null> {
    const user = await this.authRepository.findUserById(userId);
    if (!user || !user.isActive) return null;
    return { id: user.id, role: user.role };
  }

  private async issueTokenPair(userId: string, role: string): Promise<TokenPair> {
    const rawRefreshToken = generateSecureToken();
    const tokenHash = hashToken(rawRefreshToken);
    const familyId = uuidv4();
    const expiresAt = this.parseExpiry(
      this.configService.get<string>('jwt.refreshExpiresIn') ?? '7d',
    );

    await this.authRepository.storeRefreshToken({ userId, tokenHash, familyId, expiresAt });
    const accessToken = this.signAccessToken(userId, role);
    return { accessToken, refreshToken: rawRefreshToken, expiresIn: 900 };
  }

  private signAccessToken(userId: string, role: string): string {
    // JWT payload: { sub, role, iat, exp } ONLY — never include email/name/PII
    const payload: JwtPayload = { sub: userId, role };
    return this.jwtService.sign(payload);
  }

  private parseExpiry(expiry: string): Date {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const value = parseInt(match[1], 10);
    const multipliers: Record<string, number> = {
      s: 1_000,
      m: 60_000,
      h: 3_600_000,
      d: 86_400_000,
    };
    return new Date(Date.now() + value * (multipliers[match[2]] ?? 86_400_000));
  }
}
