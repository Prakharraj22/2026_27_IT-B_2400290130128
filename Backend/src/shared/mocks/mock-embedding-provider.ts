import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmbeddingProvider } from '../interfaces/embedding-provider.interface';

/**
 * Deterministic mock embedding provider for local development and tests.
 * Returns reproducible vectors based on a hash of the input.
 * NOT suitable for production — replace with real AI Worker implementation.
 */
@Injectable()
export class MockEmbeddingProvider implements EmbeddingProvider {
  private readonly dimension: number;

  constructor(private readonly configService: ConfigService) {
    this.dimension = this.configService.get<number>('vector.dimension') || 1536;
  }

  async getEmbedding(text: string): Promise<number[]> {
    return this.deterministicVector(text);
  }

  async getProfileEmbedding(userId: string): Promise<number[]> {
    return this.deterministicVector(`profile:${userId}`);
  }

  async getJobEmbedding(jobId: string): Promise<number[]> {
    return this.deterministicVector(`job:${jobId}`);
  }

  /**
   * Generates a deterministic unit vector from a seed string.
   * Same input always produces same output — critical for deterministic tests.
   */
  private deterministicVector(seed: string): number[] {
    const vector = new Array(this.dimension);
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
    }
    let magnitude = 0;
    for (let i = 0; i < this.dimension; i++) {
      const val = Math.sin(hash * (i + 1) * 0.001);
      vector[i] = val;
      magnitude += val * val;
    }
    magnitude = Math.sqrt(magnitude);
    // Normalize to unit vector
    return vector.map((v) => (magnitude > 0 ? v / magnitude : 0));
  }
}
