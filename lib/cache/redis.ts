import Redis from 'ioredis';

/**
 * Redis cache helper for TrackingMore API responses
 * Supports JSON serialization and TTL (Time To Live)
 * Falls back gracefully if Redis is not available
 */

let redisClient: Redis | null = null;

/**
 * Initialize Redis connection
 * Uses REDIS_URL from environment variable
 * Returns null if REDIS_URL is not set or connection fails
 */
function getRedisClient(): Redis | null {
  if (redisClient === null && process.env.REDIS_URL) {
    try {
      redisClient = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
          // Retry with exponential backoff, up to 3 times
          if (times > 3) {
            return null; // Stop retrying
          }
          return Math.min(times * 200, 1000);
        },
        lazyConnect: true, // Don't connect immediately
      });

      // Handle connection errors gracefully
      redisClient.on('error', (err) => {
        console.error('Redis connection error:', err.message);
        // Don't crash the app, just log the error
      });

      // Try to connect
      redisClient.connect().catch((err) => {
        console.error('Failed to connect to Redis:', err.message);
        redisClient = null;
      });

    } catch (error) {
      console.error('Failed to initialize Redis client:', error);
      redisClient = null;
    }
  }
  return redisClient;
}

/**
 * Get a value from Redis cache
 * @param key - Cache key
 * @returns Parsed JSON value or null if not found or Redis unavailable
 */
export async function get<T = any>(key: string): Promise<T | null> {
  const client = getRedisClient();
  if (!client) {
    return null;
  }

  try {
    const value = await client.get(key);
    if (value === null) {
      return null;
    }
    return JSON.parse(value) as T;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
}

/**
 * Set a value in Redis cache with optional TTL
 * @param key - Cache key
 * @param value - Value to cache (will be JSON stringified)
 * @param ttlSeconds - Time to live in seconds (optional)
 * @returns true if successful, false otherwise
 */
export async function set(key: string, value: any, ttlSeconds?: number): Promise<boolean> {
  const client = getRedisClient();
  if (!client) {
    return false;
  }

  try {
    const stringValue = JSON.stringify(value);
    if (ttlSeconds) {
      await client.setex(key, ttlSeconds, stringValue);
    } else {
      await client.set(key, stringValue);
    }
    return true;
  } catch (error) {
    console.error('Redis set error:', error);
    return false;
  }
}

/**
 * Delete a value from Redis cache
 * @param key - Cache key
 * @returns true if successful, false otherwise
 */
export async function del(key: string): Promise<boolean> {
  const client = getRedisClient();
  if (!client) {
    return false;
  }

  try {
    await client.del(key);
    return true;
  } catch (error) {
    console.error('Redis del error:', error);
    return false;
  }
}

/**
 * Check if Redis is available
 * @returns true if Redis client is connected
 */
export function isRedisAvailable(): boolean {
  const client = getRedisClient();
  return client !== null && client.status === 'ready';
}

/**
 * Close Redis connection
 * Should be called when shutting down the application
 */
export async function closeRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}
