// api/track.js
// Vercel Serverless Function לחיבור עם TrackingMore API

export default async function handler(req, res) {
  // הגדרת CORS כדי שהאתר שלך יוכל לקרוא לפונקציה
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // טיפול ב-OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // קבלת פרמטרים
  const { trackingNumber, carrier } = req.query;

  // בדיקת תקינות
  if (!trackingNumber) {
    return res.status(400).json({
      success: false,
      error: 'חסר מספר מעקב'
    });
  }

  try {
    // קריאה ל-TrackingMore API
    const apiKey = process.env.TRACKINGMORE_API_KEY;
    
    if (!apiKey) {
      throw new Error('API Key not configured');
    }

    // Create tracking (אם זה חיפוש ראשון)
    const createResponse = await fetch('https://api.trackingmore.com/v4/trackings/create', {
      method: 'POST',
      headers: {
        'Tracking-Api-Key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tracking_number: trackingNumber,
        carrier_code: carrier || 'auto' // auto-detect אם לא צוין
      })
    });

    const createData = await createResponse.json();

    // קבלת פרטי המעקב
    const getResponse = await fetch(
      `https://api.trackingmore.com/v4/trackings/get?tracking_numbers=${trackingNumber}`,
      {
        headers: {
          'Tracking-Api-Key': apiKey,
          'Content-Type': 'application/json'
        }
      }
    );

    const trackingData = await getResponse.json();

    // בדיקה אם יש תוצאות
    if (trackingData.meta && trackingData.meta.code === 200 && trackingData.data && trackingData.data.length > 0) {
      const shipment = trackingData.data[0];
      
      // עיבוד הנתונים לפורמט נוח
      const result = {
        success: true,
        tracking_number: shipment.tracking_number,
        carrier: {
          code: shipment.carrier_code,
          name: shipment.carrier_name || getCarrierNameHebrew(shipment.carrier_code)
        },
        status: {
          code: shipment.status,
          text: getStatusHebrew(shipment.status),
          lastUpdate: shipment.updated_at
        },
        origin: shipment.origin_info ? {
          country: shipment.origin_info.country,
          city: shipment.origin_info.city
        } : null,
        destination: shipment.destination_info ? {
          country: shipment.destination_info.country,
          city: shipment.destination_info.city
        } : null,
        transit_time: shipment.transit_time,
        days_after_shipping: shipment.days_after_shipping,
        events: shipment.origin_info && shipment.origin_info.trackinfo ? 
          shipment.origin_info.trackinfo.map(event => ({
            date: event.Date,
            status: event.StatusDescription,
            location: event.Details,
            checkpoint_date: event.checkpoint_date
          })) : [],
        estimated_delivery: shipment.scheduled_delivery_date
      };

      return res.status(200).json(result);
    } else {
      // אם לא נמצא
      return res.status(404).json({
        success: false,
        error: 'לא נמצא מידע עבור מספר מעקב זה',
        trackingNumber: trackingNumber
      });
    }

  } catch (error) {
    console.error('Error tracking shipment:', error);
    return res.status(500).json({
      success: false,
      error: 'שגיאה בשרת - נסה שוב מאוחר יותר',
      details: error.message
    });
  }
}

// פונקציות עזר לתרגום לעברית
function getCarrierNameHebrew(code) {
  const carriers = {
    'zim': 'ZIM',
    'maersk': 'Maersk',
    'msc': 'MSC',
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

function getStatusHebrew(status) {
  const statuses = {
    'pending': '⏳ ממתין',
    'transit': '🚢 בדרך',
    'pickup': '📦 נאסף',
    'delivered': '✅ נמסר',
    'undelivered': '❌ לא נמסר',
    'exception': '⚠️ חריג',
    'expired': '⌛ פג תוקף',
    'InfoReceived': '📋 מידע התקבל',
    'InTransit': '🌊 בהובלה',
    'OutForDelivery': '🚚 יצא למשלוח',
    'Delivered': '✅ נמסר ליעד'
  };
  return statuses[status] || status;
}
