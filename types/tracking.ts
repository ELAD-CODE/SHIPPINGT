export interface TrackingResult {
  success: true;
  tracking_number: string;
  carrier: {
    code: string;
    name: string;
  };
  status: {
    code: string;
    text: string;
    lastUpdate: string;
  };
  origin?: {
    country: string;
    city?: string;
  };
  destination?: {
    country: string;
    city?: string;
  };
  transit_time?: number;
  days_after_shipping?: number;
  events: TrackingEvent[];
  estimated_delivery?: string;
}

export interface TrackingEvent {
  date: string;
  status: string;
  location: string;
  checkpoint_date?: string;
}

export interface TrackingError {
  success: false;
  error: string;
  trackingNumber?: string;
}

export type TrackingResponse = TrackingResult | TrackingError;