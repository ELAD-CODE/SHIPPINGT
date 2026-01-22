/**
 * types/shipment.ts
 * ============================================================================
 * Type definitions for shipments (air and sea freight)
 */

export enum ShipmentType {
  AIR = 'AIR',
  SEA = 'SEA',
  ROAD = 'ROAD',
  EXPRESS = 'EXPRESS',
}

export enum ShipmentStatus {
  BOOKED = 'booked',
  IN_TRANSIT = 'in_transit',
  AT_PORT = 'at_port',
  CUSTOMS = 'customs',
  CLEARED = 'cleared',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  DELAYED = 'delayed',
  CANCELLED = 'cancelled',
}

export enum CustomsStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  CLEARED = 'cleared',
  HELD = 'held',
  INSPECTION = 'inspection',
}

export enum Priority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface CustomerInfo {
  name?: string;
  email?: string;
  phone?: string;
}

export interface LocationInfo {
  country?: string;    // ISO 3166-1 alpha-2 code
  port?: string;       // Port or airport code
  address?: string;    // Full address
}

export interface AirFreightDetails {
  airWaybillNumber?: string;
  flightNumber?: string;
  airline?: string;
  aircraftType?: string;
}

export interface SeaFreightDetails {
  billOfLading?: string;
  containerNumber?: string;
  vesselName?: string;
  voyageNumber?: string;
  containerType?: string;  // 20ft, 40ft, 40HC, 45HC, etc.
  containerCount?: number;
}

export interface CargoDetails {
  description?: string;
  hsCode?: string;        // Harmonized System code
  weight?: number;        // kg
  volume?: number;        // m³
  quantity?: number;      // pieces/packages
  declaredValue?: number; // customs value
  currency?: string;      // ISO 4217 currency code
}

export interface DocumentUrls {
  blDocument?: string;    // Bill of Lading
  invoice?: string;       // Commercial Invoice
  packingList?: string;   // Packing List
  certificate?: string;   // Certificate of Origin, etc.
}

export interface TimelineInfo {
  bookingDate?: Date | string;
  departureDate?: Date | string;
  arrivalDate?: Date | string;
  estimatedArrival?: Date | string;
  deliveryDate?: Date | string;
}

export interface CustomsInfo {
  status?: CustomsStatus | string;
  date?: Date | string;
  notes?: string;
  dutyPaid?: boolean;
  dutyAmount?: number;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  shipmentType: ShipmentType;
  
  // Customer
  customer?: CustomerInfo;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  
  // Locations
  origin?: LocationInfo;
  destination?: LocationInfo;
  originCountry?: string;
  originPort?: string;
  originAddress?: string;
  destinationCountry?: string;
  destinationPort?: string;
  destinationAddress?: string;
  
  // Air freight specific
  air?: AirFreightDetails;
  airWaybillNumber?: string;
  flightNumber?: string;
  airline?: string;
  aircraftType?: string;
  
  // Sea freight specific
  sea?: SeaFreightDetails;
  billOfLading?: string;
  containerNumber?: string;
  vesselName?: string;
  voyageNumber?: string;
  containerType?: string;
  containerCount?: number;
  
  // Documents
  documents?: DocumentUrls;
  blDocumentUrl?: string;
  invoiceUrl?: string;
  packingListUrl?: string;
  certificateUrl?: string;
  
  // Cargo
  cargo?: CargoDetails;
  cargoDescription?: string;
  hsCode?: string;
  weight?: number;
  volume?: number;
  quantity?: number;
  declaredValue?: number;
  currency?: string;
  
  // Status
  status: ShipmentStatus | string;
  statusHe?: string;
  
  // Timeline
  timeline?: TimelineInfo;
  bookingDate?: Date | string;
  departureDate?: Date | string;
  arrivalDate?: Date | string;
  estimatedArrival?: Date | string;
  deliveryDate?: Date | string;
  
  // Customs
  customs?: CustomsInfo;
  customsStatus?: CustomsStatus | string;
  customsDate?: Date | string;
  customsNotes?: string;
  dutyPaid?: boolean;
  dutyAmount?: number;
  
  // Tracking
  carrier?: string;
  carrierCode?: string;
  externalTrackingData?: any;
  
  // Internal
  assignedTo?: string;
  priority?: Priority | string;
  notes?: string;
  tags?: string[];
  leadId?: string;
  
  // Timestamps
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateShipmentInput {
  trackingNumber: string;
  shipmentType: ShipmentType;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  originCountry?: string;
  originPort?: string;
  destinationCountry?: string;
  destinationPort?: string;
  
  // Air freight fields
  airWaybillNumber?: string;
  flightNumber?: string;
  airline?: string;
  
  // Sea freight fields
  billOfLading?: string;
  containerNumber?: string;
  vesselName?: string;
  voyageNumber?: string;
  containerType?: string;
  containerCount?: number;
  
  // Cargo
  cargoDescription?: string;
  weight?: number;
  volume?: number;
  quantity?: number;
  declaredValue?: number;
  currency?: string;
  
  // Status
  status?: string;
}

export interface UpdateShipmentInput extends Partial<CreateShipmentInput> {
  id: string;
}

export interface ShipmentFilters {
  shipmentType?: ShipmentType;
  status?: ShipmentStatus | string;
  customsStatus?: CustomsStatus | string;
  carrier?: string;
  originCountry?: string;
  destinationCountry?: string;
  customerEmail?: string;
  dateFrom?: Date | string;
  dateTo?: Date | string;
  search?: string; // Search across tracking number, B/L, container number, etc.
}

export interface ShipmentListResponse {
  shipments: Shipment[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface ShipmentValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ShipmentValidationResult {
  valid: boolean;
  errors: ShipmentValidationError[];
}
