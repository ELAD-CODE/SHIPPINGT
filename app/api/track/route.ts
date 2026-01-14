// app/api/track/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const trackingNumber = searchParams.get('trackingNumber');
  const carrier = searchParams.get('carrier');

  // Validation
  if (!trackingNumber) {
    return NextResponse.json({
      success: false,
      error: 'חסר מספר מעקב'
    }, { status: 400 });
  }

  const apiKey = process.env.TRACKINGMORE_API_KEY;

  if (!apiKey) {
    console.error('TRACKINGMORE_API_KEY not configured');
    return NextResponse.json({
      success: false,
      error: 'שגיאת הגדרות שרת - נא ליצור קשר עם התמיכה'
    }, { status: 500 });
  }

  try {
    // Step 1: Create tracking
    const createResponse = await fetch('https://api.trackingmore.com/v4/trackings/create', {
      method: 'POST',
      headers: {
        'Tracking-Api-Key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tracking_number: trackingNumber,
        carrier_code: carrier || 'auto'
      })
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('TrackingMore create error:', errorText);
    }

    // Step 2: Get tracking details
    const getResponse = await fetch(
      `https://api.trackingmore.com/v4/trackings/get?tracking_numbers=${encodeURIComponent(trackingNumber)}`,
      {
        headers: {
          'Tracking-Api-Key': apiKey,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!getResponse.ok) {
      return NextResponse.json({
        success: false,
        error: 'לא הצלחנו למצוא את המשלוח - נסה שוב'
      }, { status: 404 });
    }

    const trackingData = await getResponse.json();

    // Process response
    if (trackingData.meta && trackingData.meta.code === 200 && trackingData.data && trackingData.data.length > 0) {
      const shipment = trackingData.data[0];
      
      const result = {
        success: true,
        tracking_number: shipment.tracking_number,
        carrier: {
          code: shipment.carrier_code,
          name: getCarrierNameHebrew(shipment.carrier_code)
        },
        status: {
          code: shipment.status,
          text: getStatusHebrew(shipment.status),
          lastUpdate: shipment.updated_at
        },
        origin: shipment.origin_info ? {
          country: shipment.origin_info.country,
          city: shipment.origin_info.city
        } : undefined,
        destination: shipment.destination_info ? {
          country: shipment.destination_info.country,
          city: shipment.destination_info.city
        } : undefined,
        transit_time: shipment.transit_time,
        days_after_shipping: shipment.days_after_shipping,
        events: shipment.origin_info && shipment.origin_info.trackinfo ? 
          shipment.origin_info.trackinfo.map((event: any) => ({
            date: event.Date || event.checkpoint_date,
            status: event.StatusDescription,
            location: event.Details,
            checkpoint_date: event.checkpoint_date
          })) : [],
        estimated_delivery: shipment.scheduled_delivery_date
      };

      return NextResponse.json(result);
    } else {
      return NextResponse.json({
        success: false,
        error: 'לא נמצא מידע עבור מספר מעקב זה',
        trackingNumber: trackingNumber
      }, { status: 404 });
    }

  } catch (error) {
    console.error('Track API error:', error);
    return NextResponse.json({
      success: false,
      error: 'שגיאה בשרת - נסה שוב מאוחר יותר'
    }, { status: 500 });
  }
}

// Helper functions for Hebrew translation
function getCarrierNameHebrew(code: string): string {
  const carriers: { [key: string]: string } = {
    'zim': 'ZIM - צים',
    'maersk': 'Maersk',
    'msc': 'MSC',
    'cma-cgm': 'CMA CGM',
    'israel-post': 'דואר ישראל',
    'dhl': 'DHL',
    'fedex': 'FedEx',
    'ups': 'UPS',
    'el-al-cargo': 'אל על קרגו',
    'lionwheel': 'ליונוהיל',
    'chita-express': 'צ\'יטה אקספרס'
  };
  return carriers[code] || code.toUpperCase();
}

function getStatusHebrew(status: string): string {
  const statuses: { [key: string]: string } = {
    'pending': '⏳ ממתין',
    'transit': '🚢 בדרך',
    'InfoReceived': '📋 מידע התקבל',
    'InTransit': '🌊 בהובלה',
    'OutForDelivery': '🚚 יצא למשלוח',
    'pickup': '📦 נאסף',
    'delivered': '✅ נמסר',
    'Delivered': '✅ נמסר ליעד',
    'undelivered': '❌ לא נמסר',
    'exception': '⚠️ חריג',
    'expired': '⌛ פג תוקף'
  };
  return statuses[status] || status;
}
