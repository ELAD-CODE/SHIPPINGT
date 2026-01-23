import type { TrackingResponse, TrackingEvent } from '../../types/tracking';

function firstAvailable(...vals: any[]) {
  for (const v of vals) if (v !== undefined && v !== null) return v;
  return undefined;
}

export function mapTrackingGetResponse(payload: any, trackingNumber: string, fallbackCarrier?: string): TrackingResponse {
  if (!payload) {
    return { success: false, error: 'אין נתונים' };
  }

  if (payload.meta && payload.meta.code && Number(payload.meta.code) !== 200) {
    return { success: false, error: payload.meta.message || `TrackingMore error code ${payload.meta.code}` };
  }

  const data = payload.data ?? payload;
  const originInfo = Array.isArray(data.origin_info) ? data.origin_info[0] : data;

  const carrierCode = firstAvailable(originInfo?.carrier_code, originInfo?.courier_code, fallbackCarrier, data?.carrier_code) || '';
  const carrierName = firstAvailable(originInfo?.carrier_name, originInfo?.courier_name, carrierCode) || carrierCode;

  const statusCode = firstAvailable(originInfo?.status, data?.status, originInfo?.state, data?.state, '');
  const statusTextRaw = firstAvailable(originInfo?.status_description, originInfo?.status_description, originInfo?.StatusDescription, originInfo?.Status, data?.status_text, data?.status) || '';

  const rawEvents = originInfo?.trackinfo ?? originInfo?.trackInfo ?? originInfo?.events ?? data?.events ?? [];
  const events: TrackingEvent[] = Array.isArray(rawEvents)
    ? rawEvents.map((ev: any) => {
        const date = firstAvailable(ev.Date, ev.date, ev.Time, ev.time, ev?.checkpoint_time, ev?.time_stamp) || '';
        const status = firstAvailable(ev.StatusDescription, ev.status, ev.display, ev.desc, ev.Description) || '';
        const location = firstAvailable(ev.Details, ev.location, `${ev.city ?? ''} ${ev.country ?? ''}`.trim()) || '';
        return {
          date,
          status,
          location,
          checkpoint_date: ev?.checkpoint_date ?? undefined,
        };
      })
    : [];

  const estimated = firstAvailable(originInfo?.estimated_delivery_time, data?.estimated_delivery_time, data?.eta, null);

  return {
    success: true,
    tracking_number: trackingNumber,
    carrier: { code: carrierCode, name: carrierName },
    status: { code: statusCode, text: statusTextRaw, lastUpdate: firstAvailable(originInfo?.last_update_time, data?.last_update, '') },
    origin: { country: originInfo?.original_country ?? originInfo?.origin_country, city: originInfo?.origin_city ?? undefined },
    destination: { country: originInfo?.destination_country ?? originInfo?.dest_country, city: originInfo?.destination_city ?? undefined },
    events,
    estimated_delivery: estimated ?? null,
  };
}
