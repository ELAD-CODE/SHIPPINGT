/**
 * Type definitions for Shipment Tracking System
 */

export interface TrackingEvent {
  time: string;
  status: string;
  location?: string;
  description?: string;
}

export interface LocationInfo {
  country?: string;
  city?: string;
  code?: string;
}

export interface CarrierInfo {
  code: string;
  name: string;
  nameHebrew?: string;
  logo?: string;
}

export interface TrackingStatus {
  code: string;
  text: string;
  emoji?: string;
  color?: string;
  lastUpdate?: string;
}

export interface TrackingResult {
  success: true;
  tracking_number: string;
  carrier: CarrierInfo;
  status: TrackingStatus;
  origin?: LocationInfo;
  destination?: LocationInfo;
  transit_time?: number;
  days_after_shipping?: number;
  events: TrackingEvent[];
  estimated_delivery?: string;
  raw_data?: any;
}

export interface TrackingError {
  success: false;
  error: string;
  trackingNumber?: string;
  details?: string;
}

export interface CarrierPattern {
  code: string;
  name: string;
  nameHebrew: string;
  patterns: RegExp[];
  apiCode?: string;
}

export interface RecentSearch {
  trackingNumber: string;
  carrier: string;
  timestamp: number;
  status?: string;
}

export interface CarrierListResponse {
  success: boolean;
  data: Array<{
    code: string;
    name: string;
    nameHebrew?: string;
  }>;
  error?: string;
}

export type TrackingResponse = TrackingResult | TrackingError;
