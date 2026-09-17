import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
  DIRECT_URL: Joi.string().optional(),
  REDIS_URL: Joi.string().default('redis://localhost:6379'),
  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_EXPIRY: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRY: Joi.string().default('7d'),
  ARGON2_MEMORY_COST: Joi.number().default(19456),
  ARGON2_TIME_COST: Joi.number().default(2),
  ARGON2_PARALLELISM: Joi.number().default(1),
  RATE_LIMIT_TTL: Joi.number().default(60000),
  RATE_LIMIT_MAX: Joi.number().default(100),
  RATE_LIMIT_AUTH_MAX: Joi.number().default(10),
  CORS_ORIGINS: Joi.string().default('http://localhost:3001'),
  VECTOR_DIMENSION: Joi.number().default(1536),
  CACHE_TTL: Joi.number().default(3600),
  AI_WORKER_TIMEOUT_MS: Joi.number().default(5000),
}).options({ allowUnknown: true });
