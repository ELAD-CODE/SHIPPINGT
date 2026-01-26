/**
 * TrackingMore API Client
 * Handles all interactions with the TrackingMore API
 */

import axios, { AxiosRequestConfig } from 'axios';
import { TrackingResult, TrackingError } from '@/types/index';

const TRACKINGMORE_BASE_URL = 'https://api.trackingmore.com/v3/trackings';
const API_TIMEOUT = 15000;

interface TrackingMoreResponse {
  code: number;
  message: string;
  data: any[];
}

/**
 * Create axios config with API key
 */
function getAxiosConfig(): AxiosRequestConfig {
  const apiKey = process.env.TRACKINGMORE_API_KEY;

  if (!apiKey) {
    throw new Error('TRACKINGMORE_API_KEY is not defined in environment variables');
  }

  return {
    headers: {
      'Tracking-Api-Key': apiKey,
      'Content-Type': 'application/json',
    },
    timeout: API_TIMEOUT,
  };
}

/**
 * Detect carrier from tracking number (server-side)
 */
export async function detectCarrierFromAPI(
  trackingNumber: string
): Promise<{ code: string; name: string } | null> {
  try {
    const response = await axios.post<TrackingMoreResponse>(
      `${TRACKINGMORE_BASE_URL}/detect`,
      { tracking_number: trackingNumber },
      getAxiosConfig()
    );

    if (response.data.code === 200 && response.data.data.length > 0) {
      return {
        code: response.data.data[0].courier_code,
        name: response.data.data[0].courier_name,
      };
    }

    return null;
  } catch (error) {
    console.error('Carrier detection error:', error);
    return null;
  }
}

/**
 * Get tracking details from TrackingMore
 */
export async function getTrackingDetails(
  trackingNumber: string,
  carrierCode?: string
): Promise<TrackingResult | TrackingError> {
  try {
    // First, try to detect the carrier if not provided
    let code = carrierCode;

    if (!code || code === 'auto') {
      const detected = await detectCarrierFromAPI(trackingNumber);
      if (detected) {
        code = detected.code;
      } else {
        code = 'auto';
      }
    }

    // Create tracking in TrackingMore (or update if exists)
    await axios.post(
      `${TRACKINGMORE_BASE_URL}/create`,
      {
        tracking_number: trackingNumber,
        courier_code: code,
      },
      getAxiosConfig()
    );

    // Get tracking data
    const response = await axios.post<TrackingMoreResponse>(
      `${TRACKINGMORE_BASE_URL}/get`,
      {
        tracking_numbers: trackingNumber,
        courier_code: code,
      },
      getAxiosConfig()
    );

    if (
      response.data.code === 200 &&
      response.data.data &&
      response.data.data.length > 0
    ) {
      const data = response.data.data[0];

      return {
        success: true,
        tracking_number: data.tracking_number,
        carrier: {
          code: data.courier_code,
          name: data.courier_name,
        },
        status: {
          code: data.status,
          text: translateStatusToHebrew(data.status),
          lastUpdate: data.updated_at,
        },
        origin: data.origin_info
          ? {
              country: data.origin_info.country,
              city: data.origin_info.city,
            }
          : undefined,
        destination: data.destination_info
          ? {
              country: data.destination_info.country,
              city: data.destination_info.city,
            }
          : undefined,
        events: (data.track_info || []).map((event: any) => ({
          time: event.event_time,
          status: event.status,
          location: event.location,
          description: event.description,
        })),
        estimated_delivery: data.estimated_delivery,
        raw_data: data,
      };
    }

    return {
      success: false,
      error: 'לא נמצא מידע על משלוח זה',
      trackingNumber,
    };
  } catch (error) {
    console.error('Tracking API error:', error);

    return {
      success: false,
      error: 'שגיאה בחיבור לשירות ההעקבה',
      trackingNumber,
      details: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Translate status to Hebrew
 */
function translateStatusToHebrew(status: string): string {
  const statusMap: Record<string, string> = {
    pending: 'בהמתנה',
    in_transit: 'בדרך',
    in_warehouse: 'במחסן',
    delivered: 'הגיע ליעד',
    undelivered: 'לא הגיע',
    exception: 'בעיה במסירה',
    returned: 'הוחזר לשולח',
  };

  return statusMap[status.toLowerCase()] || status;
}

/**
 * Get all supported carriers
 */
export async function getAllSupportedCarriers(): Promise<any[]> {
  try {
    const response = await axios.get<any>(
      'https://api.trackingmore.com/v3/carriers',
      getAxiosConfig()
    );

    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching carriers:', error);
    return [];
  }
}
