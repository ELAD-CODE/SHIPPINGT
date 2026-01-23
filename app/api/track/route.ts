import { NextResponse } from 'next/server';
import { mapTrackingGetResponse } from '../../../lib/tracking/converters';

const TRACKINGMORE_CREATE = 'https://api.trackingmore.com/v4/trackings/create';
const TRACKINGMORE_GET_BASE = 'https://api.trackingmore.com/v4/trackings/get';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const trackingNumber = url.searchParams.get('trackingNumber');
  const carrier = url.searchParams.get('carrier');
  const lang = url.searchParams.get('lang') ?? 'en';

  if (!trackingNumber) {
    return NextResponse.json({ success: false, error: 'trackingNumber נדרש' }, { status: 400 });
  }

  const key = process.env.TRACKINGMORE_API_KEY;
  if (!key) {
    return NextResponse.json({ success: false, error: 'TRACKINGMORE_API_KEY לא מוגדר' }, { status: 500 });
  }

  try {
    // Try to create tracking (optional step)
    try {
      const createBody: any = { tracking_number: trackingNumber };
      if (carrier) createBody.courier_code = carrier;

      await fetch(TRACKINGMORE_CREATE, {
        method: 'POST',
        headers: {
          'Tracking-Api-Key': key,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createBody),
      });
    } catch (createErr) {
      console.warn('TrackingMore create failed (ignored):', createErr);
    }

    // Get tracking information
    const getUrl = `${TRACKINGMORE_GET_BASE}?lang=${encodeURIComponent(lang)}&express=${encodeURIComponent(carrier ?? '')}&tracknumber=${encodeURIComponent(trackingNumber)}`;
    const getRes = await fetch(getUrl, {
      method: 'GET',
      headers: {
        'Tracking-Api-Key': key,
        'Content-Type': 'application/json',
      },
    });

    if (!getRes.ok) {
      const txt = await getRes.text();
      return NextResponse.json({ success: false, error: 'שגיאה ב-TrackingMore (GET)', details: txt }, { status: getRes.status });
    }

    const payload = await getRes.json();

    // Convert response using our converter
    const mapped = mapTrackingGetResponse(payload, trackingNumber, carrier ?? undefined);
    if (!mapped.success) {
      return NextResponse.json(mapped, { status: 502 });
    }

    return NextResponse.json(mapped);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'שגיאת שרת', details: err.message || String(err) }, { status: 500 });
  }
}