export const EMBEDDING_PROVIDER = 'EMBEDDING_PROVIDER';

/**
 * Interface for the AI Worker embedding service.
 * In local dev and tests, a deterministic mock implementation is used.
 * In production, the AI Worker team implements this interface.
 */
export interface EmbeddingProvider {
  /**
   * Get embedding vector for arbitrary text.
   * Returns null if AI Worker is unavailable.
   */
  getEmbedding(text: string): Promise<number[] | null>;

  /**
   * Get pre-computed profile embedding from AI Worker.
   * Returns null if not yet computed or AI Worker is unavailable.
   */
  getProfileEmbedding(userId: string): Promise<number[] | null>;

  /**
   * Get pre-computed job embedding from AI Worker.
   * Returns null if not yet computed or AI Worker is unavailable.
   */
  getJobEmbedding(jobId: string): Promise<number[] | null>;
}
