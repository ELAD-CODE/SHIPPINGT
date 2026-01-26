/**
 * GET /api/carriers
 * Returns list of supported carriers for dropdown
 */

import { NextResponse } from 'next/server';
import { getAllCarriers } from '@/lib/carriers';

export async function GET() {
  try {
    const carriers = getAllCarriers();

    return NextResponse.json({
      success: true,
      data: carriers.map((carrier) => ({
        code: carrier.code,
        name: carrier.name,
        nameHebrew: carrier.nameHebrew,
      })),
    });
  } catch (error) {
    console.error('Carriers API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'שגיאה בטעינת רשימת הספקים',
        data: [],
      },
      { status: 500 }
    );
  }
}
