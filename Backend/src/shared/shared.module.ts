import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaService } from './database/prisma.service';
import { RedisService } from './redis/redis.service';
import { MockEmbeddingProvider } from './mocks/mock-embedding-provider';
import { EMBEDDING_PROVIDER } from './interfaces/embedding-provider.interface';

@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 20,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),
  ],
  providers: [
    PrismaService,
    RedisService,
    {
      provide: EMBEDDING_PROVIDER,
      useClass: MockEmbeddingProvider,
      // In production: replace MockEmbeddingProvider with RealEmbeddingProvider
      // that calls the AI Worker service
    },
  ],
  exports: [PrismaService, RedisService, EMBEDDING_PROVIDER],
})
export class SharedModule {}
