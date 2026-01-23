import { describe, it, expect, beforeEach } from '@jest/globals';
import * as redis from './redis';

describe('Redis Cache Module', () => {
  // Mock Redis - these tests verify the module interface without requiring a real Redis connection
  
  beforeEach(() => {
    // Ensure REDIS_URL is not set for most tests to test fallback behavior
    delete process.env.REDIS_URL;
  });

  describe('get', () => {
    it('should return null when Redis is not available', async () => {
      const result = await redis.get('test-key');
      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('should return false when Redis is not available', async () => {
      const result = await redis.set('test-key', { data: 'test' });
      expect(result).toBe(false);
    });
  });

  describe('del', () => {
    it('should return false when Redis is not available', async () => {
      const result = await redis.del('test-key');
      expect(result).toBe(false);
    });
  });

  describe('isRedisAvailable', () => {
    it('should return false when REDIS_URL is not set', () => {
      const result = redis.isRedisAvailable();
      expect(result).toBe(false);
    });
  });

  describe('closeRedis', () => {
    it('should not throw when closing non-existent connection', async () => {
      await expect(redis.closeRedis()).resolves.not.toThrow();
    });
  });
});
