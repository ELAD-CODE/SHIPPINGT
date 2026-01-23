import * as redis from '@/lib/cache/redis';

// להורדת רשימת כל ה-carriers (cache it)
// In-memory cache as fallback when Redis is not available
let inMemoryCache: { data: any; timestamp: number } | null = null;
const CACHE_TTL_SECONDS = 24 * 60 * 60; // 24 hours
const CACHE_KEY = 'trackingmore:carriers:list';

export async function GET() {
  try {
    // Try to get from Redis first
    const cachedData = await redis.get(CACHE_KEY);
    if (cachedData) {
      console.log('Carriers data served from Redis cache');
      return Response.json(cachedData);
    }

    // Fallback to in-memory cache if Redis is not available
    if (inMemoryCache) {
      const age = Date.now() - inMemoryCache.timestamp;
      if (age < CACHE_TTL_SECONDS * 1000) {
        console.log('Carriers data served from in-memory cache');
        return Response.json(inMemoryCache.data);
      }
    }

    // Fetch fresh data from TrackingMore API
    console.log('Fetching carriers data from TrackingMore API');
    const response = await fetch('https://api.trackingmore.com/v2/carriers', {
      headers: {
        'Trackingmore-Api-Key': process.env.TRACKING_MORE_API_KEY || '',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`TrackingMore API error: ${response.status}`);
    }

    const data = await response.json();

    // Cache in Redis (if available)
    const redisCached = await redis.set(CACHE_KEY, data, CACHE_TTL_SECONDS);
    if (redisCached) {
      console.log('Carriers data cached in Redis');
    } else {
      // Fallback to in-memory cache
      inMemoryCache = { data, timestamp: Date.now() };
      console.log('Carriers data cached in memory (Redis unavailable)');
    }

    return Response.json(data);
  } catch (error) {
    console.error('Error fetching carriers:', error);
    
    // Return cached data even if expired, better than nothing
    if (inMemoryCache) {
      console.log('Returning stale in-memory cache due to error');
      return Response.json(inMemoryCache.data);
    }

    return Response.json(
      { error: 'Failed to fetch carriers data' },
      { status: 500 }
    );
  }
}