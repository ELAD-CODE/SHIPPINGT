/**
 * Shipment Validation Utilities
 * Shared validation functions for shipments across frontend and backend
 */

// ISO 6346 Container Number Format: 4 letters + 7 digits
export const CONTAINER_NUMBER_REGEX = /^[A-Z]{4}[0-9]{7}$/;

// Bill of Lading Format: Typically carrier code (4 letters) + 8-12 digits
export const BL_NUMBER_REGEX = /^[A-Z]{4}\d{8,12}$/;

/**
 * Validate ISO 6346 container number format
 * Format: 4 capital letters + 7 digits (e.g., MSCU1234567)
 */
export function validateContainerNumber(containerNumber: string): boolean {
  if (!containerNumber) return false;
  return CONTAINER_NUMBER_REGEX.test(containerNumber);
}

/**
 * Validate Bill of Lading number format
 * Format: 4 capital letters + 8-12 digits (e.g., MAEU123456789)
 */
export function validateBLNumber(blNumber: string): boolean {
  if (!blNumber) return false;
  return BL_NUMBER_REGEX.test(blNumber);
}

/**
 * Validate sea shipment data
 * Returns validation result with errors array
 */
export function validateSeaShipment(data: {
  containerNumber?: string;
  blNumber?: string;
  vesselName?: string;
  voyageNumber?: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.containerNumber) {
    errors.push('container_number is required for sea shipments');
  } else if (!validateContainerNumber(data.containerNumber)) {
    errors.push('container_number must be in ISO 6346 format (e.g., MSCU1234567)');
  }
  
  if (!data.blNumber) {
    errors.push('bl_number (Bill of Lading) is required for sea shipments');
  }
  
  if (!data.vesselName) {
    errors.push('vessel_name is required for sea shipments');
  }
  
  if (!data.voyageNumber) {
    errors.push('voyage_number is required for sea shipments');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Israeli phone number
 * Format: 05xxxxxxxx (with optional dashes/spaces)
 */
export function validateIsraeliPhone(phone: string): boolean {
  if (!phone) return false;
  const cleanPhone = phone.replace(/[-\s]/g, '');
  const phoneRegex = /^05\d{8}$/;
  return phoneRegex.test(cleanPhone);
}

/**
 * Check if shipment type requires sea shipment validation
 */
export function isSeaShipment(shipmentType: string): boolean {
  return shipmentType === 'sea' || shipmentType === 'ocean';
}

/**
 * Check if shipment type is air freight
 */
export function isAirShipment(shipmentType: string): boolean {
  return shipmentType === 'air' || shipmentType === 'awb';
}

/**
 * Check if shipment type is express/courier
 */
export function isExpressShipment(shipmentType: string): boolean {
  return shipmentType === 'express' || shipmentType === 'courier' || shipmentType === 'ground';
}
