import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';
import { Request, Response } from 'express';

@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Track authenticated users by userId; fall back to client IP for unauthenticated requests
    return req.user?.id ?? req.ip ?? 'unknown';
  }

  protected async throwThrottlingException(context: ExecutionContext): Promise<void> {
    const res = context.switchToHttp().getResponse<Response>();
    if (res && typeof res.setHeader === 'function') {
      res.setHeader('Retry-After', '60');
    }
    throw new ThrottlerException('Rate limit exceeded. Please try again later.');
  }
}
