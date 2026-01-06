// lib/trackingApis.ts
// חיבור ל-TrackingMore API ו-APIs אחרים

import { TrackingResult, TrackingError } from '@/types/tracking';
import { getStatusHebrew, getCarrierByCode } from './carriers';

const TRACKINGMORE_API_KEY = process.env.TRACKINGMORE_API_KEY;
const TRACKINGMORE_BASE_URL = 'https://api.trackingmore.com/v4';

/**
 * חיבור ל-TrackingMore API
 */
export async function trackWithTrackingMore(
  trackingNumber: string,
  carrierCode?: string
): Promise<TrackingResult | TrackingError> {
  if (!TRACKINGMORE_API_KEY) {
    return {
      success: false,
      error: 'API Key לא מוגדר בשרת',
    };
  }

  try {
    // שלב 1: יצירת tracking (אם זה חיפוש ראשון)
    const createResponse = await fetch(`${TRACKINGMORE_BASE_URL}/trackings/create`, {
      method: 'POST',
      headers: {
        'Tracking-Api-Key': TRACKINGMORE_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tracking_number: trackingNumber,
        carrier_code: carrierCode || 'auto',
      }),
    });

    // לא חייבים שה-create יצליח - ייתכן שהמעקב כבר קיים
    
    // שלב 2: שליפת הנתונים
    const getResponse = await fetch(
      `${TRACKINGMORE_BASE_URL}/trackings/get?tracking_numbers=${encodeURIComponent(trackingNumber)}`,
      {
        headers: {
          'Tracking-Api-Key': TRACKINGMORE_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!getResponse.ok) {
      throw new Error(`TrackingMore API error: ${getResponse.status}`);
    }

    const data = await getResponse.json();

    // בדיקה אם יש נתונים
    if (data.meta?.code === 200 && data.data && data.data.length > 0) {
      return normalizeTrackingMoreData(data.data[0]);
    } else {
      return {
        success: false,
        error: 'לא נמצא מידע עבור מספר מעקב זה',
        trackingNumber,
      };
    }
  } catch (error) {
    console.error('TrackingMore API Error:', error);
    return {
      success: false,
      error: 'שגיאה בחיבור ל-TrackingMore API',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * המרת נתוני TrackingMore לפורמט אחיד
 */
function normalizeTrackingMoreData(shipment: any): TrackingResult {
  const carrier = getCarrierByCode(shipment.carrier_code);
  
  return {
    success: true,
    tracking_number: shipment.tracking_number,
    carrier: {
      code: shipment.carrier_code,
      name: shipment.carrier_name || carrier?.name || shipment.carrier_code.toUpperCase(),
      nameHebrew: carrier?.nameHebrew,
    },
    status: {
      code: shipment.status,
      text: getStatusHebrew(shipment.status),
      lastUpdate: shipment.updated_at,
    },
    origin: shipment.origin_info
      ? {
          country: shipment.origin_info.country,
          city: shipment.origin_info.city,
        }
      : undefined,
    destination: shipment.destination_info
      ? {
          country: shipment.destination_info.country,
          city: shipment.destination_info.city,
        }
      : undefined,
    transit_time: shipment.transit_time,
    days_after_shipping: shipment.days_after_shipping,
    events:
      shipment.origin_info?.trackinfo?.map((event: any) => ({
        date: event.Date || event.checkpoint_date,
        status: event.StatusDescription || event.status,
        location: event.Details || event.location,
        details: event.Details,
        checkpoint_date: event.checkpoint_date,
      })) || [],
    estimated_delivery: shipment.scheduled_delivery_date,
    raw_data: shipment,
  };
}

/**
 * פונקציה ראשית - ינסה TrackingMore, ואם זה נכשל ינסה APIs אחרים
 */
export async function trackShipment(
  trackingNumber: string,
  carrierCode?: string
): Promise<TrackingResult | TrackingError> {
  // ניסיון ראשון: TrackingMore
  const result = await trackWithTrackingMore(trackingNumber, carrierCode);
  
  if (result.success) {
    return result;
  }
  
  // TODO: כאן אפשר להוסיף fallback ל-APIs אחרים
  // לדוגמה:
  // - AfterShip
  // - Ship24
  // - API ישיר של חברות הספנות
  
  return result;
}
