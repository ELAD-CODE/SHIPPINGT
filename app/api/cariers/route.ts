import { NextResponse } from 'next/server';

const TRACKINGMORE_CARRIERS_URL = 'https://api.trackingmore.com/v4/carriers';
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 שעות

type CarrierItem = { code: string; name: string };

// simple in-memory cache on the server (per process)
declare global {
  var __tm_carriers_cache: { data: CarrierItem[]; expiresAt: number } | undefined;
}

async function fetchCarriersFromAPI(key: string) {
  const res = await fetch(TRACKINGMORE_CARRIERS_URL, {
    method: 'GET',
    headers: {
      'Tracking-Api-Key': key,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`TrackingMore error: ${res.status} ${t}`);
  }
  const json = await res.json();
  const data = json?.data ?? json;
  const mapped = Array.isArray(data)
    ? data.map((c: any) => ({ code: c.code ?? c.slug ?? (c.name || '').toLowerCase(), name: c.name ?? c.code }))
    : [];
  return mapped as CarrierItem[];
}

export async function GET() {
  const key = process.env.TRACKINGMORE_API_KEY;
  if (!key) {
    return NextResponse.json({ error: 'TRACKINGMORE_API_KEY לא מוגדר' }, { status: 500 });
  }

  try {
    const now = Date.now();
    if (global.__tm_carriers_cache && global.__tm_carriers_cache.expiresAt > now) {
      return NextResponse.json({ data: global.__tm_carriers_cache.data });
    }

    const data = await fetchCarriersFromAPI(key);

    global.__tm_carriers_cache = { data, expiresAt: now + CACHE_TTL_MS };

    const res = NextResponse.json({ data });
    res.headers.set('Cache-Control', `public, max-age=${60 * 60 * 24}`); // 24h
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: 'שגיאת רשת ב-TrackingMore', details: err.message || String(err) }, { status: 500 });
  }
}

/* Redis דוגמה - הערות בתוך הקובץ לשימוש במידת הצורך */
/*
 * For production with Redis:
 * 
 * import Redis from 'ioredis';
 * const redis = new Redis(process.env.REDIS_URL);
 * 
 * In GET():
 * const cached = await redis.get('carriers');
 * if (cached) return NextResponse.json({ data: JSON.parse(cached) });
 * 
 * const data = await fetchCarriersFromAPI(key);
 * await redis.set('carriers', JSON.stringify(data), 'EX', 60 * 60 * 24);
 * return NextResponse.json({ data });
 */