import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { PrismaService } from '../../shared/database/prisma.service';
import { RedisService } from '../../shared/redis/redis.service';
import { Public } from '../decorators/public.decorator';

@ApiTags('health')
@Controller({ path: 'health', version: '1' })
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  @Get()
  @Public()
  @SkipThrottle()
  @ApiOperation({ summary: 'Service health check' })
  @ApiResponse({
    status: 200,
    description: 'Health status — "ok" or "degraded". Never leaks internal error details.',
  })
  async check() {
    const [dbResult, redisResult] = await Promise.allSettled([
      this.prisma.isHealthy(),
      this.redis.isHealthy(),
    ]);

    const db =
      dbResult.status === 'fulfilled' && dbResult.value === true ? 'ok' : 'error';
    const redis =
      redisResult.status === 'fulfilled' && redisResult.value === true ? 'ok' : 'error';
    const status = db === 'ok' && redis === 'ok' ? 'ok' : 'degraded';

    // Never leak internal error messages or stack traces in health response
    return {
      status,
      uptime: Math.floor(process.uptime()),
      db,
      redis,
      timestamp: new Date().toISOString(),
    };
  }
}
