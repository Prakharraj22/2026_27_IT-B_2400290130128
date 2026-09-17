import { createHash, timingSafeEqual } from 'crypto';

/**
 * SHA-256 hash for refresh tokens.
 * Using SHA-256 (not Argon2) because refresh tokens are long-random values,
 * not user-chosen secrets. SHA-256 is fast and non-reversible.
 */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * Timing-safe comparison of two token hashes.
 * Prevents timing-based attacks.
 */
export function safeCompareTokens(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, 'hex');
    const bufB = Buffer.from(b, 'hex');
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * Generate a cryptographically secure random token.
 */
export function generateSecureToken(bytes = 48): string {
  const { randomBytes } = require('crypto');
  return randomBytes(bytes).toString('hex');
}
