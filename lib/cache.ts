// lib/cache.ts
// מערכת Cache פשוטה לשמירת תוצאות מעקב

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number; // Time To Live במילישניות
}

class SimpleCache {
  private cache: Map<string, CacheEntry> = new Map();
  
  /**
   * שומר ערך ב-cache
   * @param key מפתח
   * @param data הנתונים
   * @param ttl זמן תוקף בדקות (ברירת מחדל: 10 דקות)
   */
  set(key: string, data: any, ttl: number = 10): void {
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      ttl: ttl * 60 * 1000, // המרה לmilliseconds
    };
    this.cache.set(key, entry);
  }
  
  /**
   * מחזיר ערך מה-cache אם הוא עדיין תקף
   */
  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    const now = Date.now();
    const age = now - entry.timestamp;
    
    // אם עבר הזמן - מוחק את הערך
    if (age > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }
  
  /**
   * מוחק ערך מה-cache
   */
  delete(key: string): void {
    this.cache.delete(key);
  }
  
  /**
   * מנקה את כל ה-cache
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * מחזיר את גודל ה-cache
   */
  size(): number {
    return this.cache.size;
  }
  
  /**
   * מנקה ערכים שפג תוקפם
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      const age = now - entry.timestamp;
      if (age > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// יצירת instance יחיד
const trackingCache = new SimpleCache();

// ניקוי אוטומטי כל 5 דקות
if (typeof window === 'undefined') {
  // רק בצד השרת
  setInterval(() => {
    trackingCache.cleanup();
  }, 5 * 60 * 1000);
}

/**
 * יצירת מפתח cache ייחודי
 */
export function getCacheKey(trackingNumber: string, carrier?: string): string {
  return `tracking:${trackingNumber}:${carrier || 'auto'}`.toLowerCase();
}

export default trackingCache;
