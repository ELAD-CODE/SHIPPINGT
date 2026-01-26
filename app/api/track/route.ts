/**
 * GET /api/track?trackingNumber=...&carrier=...
 * Main endpoint for tracking shipments
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTrackingDetails } from '@/lib/trackingmore';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const trackingNumber = searchParams.get('trackingNumber');
    const carrier = searchParams.get('carrier');

    // Validate input
    if (!trackingNumber || !trackingNumber.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'מספר מעקב לא תקין',
        },
        { status: 400 }
      );
    }

    // Get tracking details
    const result = await getTrackingDetails(trackingNumber.trim(), carrier || undefined);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Track API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'שגיאה בשרת',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
