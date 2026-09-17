export const JOB_FETCHER = 'JOB_FETCHER';

export interface RawJobData {
  sourceId: string;
  title: string;
  company: string;
  description?: string;
  location?: string;
  remote?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
  postedAt?: Date;
}

/**
 * Interface for job data fetchers.
 * Swap MockJobFetcher for a real API implementation (e.g., AdzunaJobFetcher)
 * without any changes to the ingestion pipeline.
 */
export interface IJobFetcher {
  /** Fetch a batch of raw job data from the source. */
  fetch(options?: FetchOptions): Promise<RawJobData[]>;
  /** Unique identifier for this data source. */
  readonly sourceName: string;
}

export interface FetchOptions {
  limit?: number;
  offset?: number;
  since?: Date;
}
