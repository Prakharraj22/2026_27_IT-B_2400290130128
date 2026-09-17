export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    url: process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_URL,
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
  },
  argon2: {
    memoryCost: parseInt(process.env.ARGON2_MEMORY_COST, 10) || 19456,
    timeCost: parseInt(process.env.ARGON2_TIME_COST, 10) || 2,
    parallelism: parseInt(process.env.ARGON2_PARALLELISM, 10) || 1,
  },
  rateLimit: {
    ttl: parseInt(process.env.RATE_LIMIT_TTL, 10) || 60000,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
    authMax: parseInt(process.env.RATE_LIMIT_AUTH_MAX, 10) || 10,
  },
  cors: {
    origins: (process.env.CORS_ORIGINS || 'http://localhost:3001').split(','),
  },
  vector: {
    dimension: parseInt(process.env.VECTOR_DIMENSION, 10) || 1536,
  },
  cache: {
    ttl: parseInt(process.env.CACHE_TTL, 10) || 3600,
  },
  aiWorker: {
    timeoutMs: parseInt(process.env.AI_WORKER_TIMEOUT_MS, 10) || 5000,
  },
});
