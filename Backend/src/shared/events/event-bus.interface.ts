export const EVENT_BUS = 'EVENT_BUS';

export interface IEventBus {
  emit(event: string, payload: unknown): boolean;
}

// Domain event types
export interface UserProfileUpdatedEvent {
  userId: string;
  updatedFields: string[];
  updatedAt: Date;
}

export interface MarketIngestionCompletedEvent {
  jobsIngested: number;
  source: string;
  completedAt: Date;
}

export interface MarketTrendsUpdatedEvent {
  period: string;
  skillsAggregated: number;
  completedAt: Date;
}

export const EVENTS = {
  USER_PROFILE_UPDATED: 'user.profile.updated',
  MARKET_INGESTION_COMPLETED: 'market.ingestion.completed',
  MARKET_TRENDS_UPDATED: 'market.trends.updated',
} as const;
