// app/api/track/route.ts
// Vercel Serverless Function - מעקב אחר משלוחים

import { NextRequest, NextResponse } from 'next/server';
import { trackShipment } from '@/lib/trackingApis';
import { detectCarrier } from '@/lib/carriers';
import trackingCache, { getCacheKey } from '@/lib/cache';

export const runtime = 'edge'; // ריצה ב-Edge Runtime לביצועים טובים יותר

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const trackingNumber = searchParams.get('trackingNumber');
  const carrier = searchParams.get('carrier');

  // בדיקת תקינות
  if (!trackingNumber) {
    return NextResponse.json(
      {
        success: false,
        error: 'חסר מספר מעקב',
      },
      { status: 400 }
    );
  }

  const cleanTrackingNumber = trackingNumber.trim().toUpperCase();

  try {
    // בדיקה אם יש בcache
    const cacheKey = getCacheKey(cleanTrackingNumber, carrier || undefined);
    const cached = trackingCache.get(cacheKey);

    if (cached) {
      console.log(`Cache hit for ${cleanTrackingNumber}`);
      return NextResponse.json({
        ...cached,
        cached: true,
      });
    }

    // זיהוי אוטומטי של ספק אם לא צוין
    let carrierCode = carrier;
    if (!carrierCode || carrierCode === 'auto') {
      const detected = detectCarrier(cleanTrackingNumber);
      if (detected) {
        carrierCode = detected.apiCode || detected.code;
        console.log(`Auto-detected carrier: ${carrierCode} (${detected.name})`);
      }
    }

    // קריאה ל-API
    const result = await trackShipment(cleanTrackingNumber, carrierCode || undefined);

    // אם הצליח - שמירה בcache
    if (result.success) {
      trackingCache.set(cacheKey, result, 10); // 10 דקות
    }

    // בחירת status code
    const statusCode = result.success ? 200 : 404;

    return NextResponse.json(result, { status: statusCode });
  } catch (error) {
    console.error('Error in track API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'שגיאה בשרת - נסה שוב מאוחר יותר',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// תמיכה ב-CORS (אם צריך)
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
