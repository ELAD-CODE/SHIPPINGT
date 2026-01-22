/**
 * types/shipment.ts
 * Type definitions for shipment tracking with sea freight support
 */

export type ShipmentType = 'air' | 'sea';

export type ShipmentStatus = 
  | 'pending'
  | 'in_transit'
  | 'at_port'
  | 'customs_clearance'
  | 'out_for_delivery'
  | 'delivered'
  | 'delayed'
  | 'cancelled';

export interface BaseShipment {
  id: string;
  trackingNumber: string;
  shipmentType: ShipmentType;
  carrier?: string;
  
  // Origin and destination
  origin?: string;
  destination?: string;
  
  // Customer details
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  
  // Cargo details
  description?: string;
  referenceNumber?: string;
  notes?: string;
  
  // Status
  status?: ShipmentStatus;
  lastUpdate?: Date | string;
  estimatedArrival?: Date | string;
  actualArrival?: Date | string;
  
  // Timestamps
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface AirShipment extends BaseShipment {
  shipmentType: 'air';
  awbNumber?: string;
  airline?: string;
  flightNumber?: string;
}

export interface SeaShipment extends BaseShipment {
  shipmentType: 'sea';
  containerNumber: string;  // Required for sea
  containerCount?: number;
  blNumber: string;         // Required for sea
  vesselName?: string;
  voyageNumber?: string;
  blDocumentUrl?: string;
}

export type Shipment = AirShipment | SeaShipment;

// Request types for API
export interface CreateShipmentRequest {
  trackingNumber: string;
  shipmentType: ShipmentType;
  carrier?: string;
  origin?: string;
  destination?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  description?: string;
  referenceNumber?: string;
  notes?: string;
  
  // Air specific
  awbNumber?: string;
  airline?: string;
  flightNumber?: string;
  
  // Sea specific
  containerNumber?: string;
  containerCount?: number;
  blNumber?: string;
  vesselName?: string;
  voyageNumber?: string;
  blDocumentUrl?: string;
}

export interface UpdateShipmentRequest extends Partial<CreateShipmentRequest> {
  status?: ShipmentStatus;
  lastUpdate?: string;
  estimatedArrival?: string;
  actualArrival?: string;
}

// Response types
export interface ShipmentResponse {
  success: boolean;
  message?: string;
  message_he?: string;
  data?: Shipment;
}

export interface ShipmentsListResponse {
  success: boolean;
  message?: string;
  data?: {
    shipments: Shipment[];
    total: number;
    page: number;
    perPage: number;
  };
}

// Validation errors
export interface ValidationError {
  field: string;
  message: string;
  message_he: string;
}

export interface ShipmentErrorResponse {
  success: false;
  message: string;
  message_he: string;
  errors?: ValidationError[];
}

// CSV import types
export interface CSVImportRow {
  tracking_number: string;
  shipment_type: string;
  carrier?: string;
  origin?: string;
  destination?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  description?: string;
  reference_number?: string;
  notes?: string;
  
  // Air fields
  awb_number?: string;
  airline?: string;
  flight_number?: string;
  
  // Sea fields
  container_number?: string;
  container_count?: string;
  bl_number?: string;
  vessel_name?: string;
  voyage_number?: string;
  bl_document_url?: string;
}

export interface CSVImportResult {
  success: boolean;
  imported: number;
  failed: number;
  errors: Array<{
    row: number;
    errors: ValidationError[];
  }>;
}
