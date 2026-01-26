/**
 * lib/shipmentValidation.ts
 * ============================================================================
 * CENTRALIZED SHIPMENT VALIDATION
 * 
 * This module contains all validation rules and regex patterns for different
 * shipment types to ensure consistency across the application.
 */

// ============================================================================
// VALIDATION REGEX PATTERNS
// ============================================================================

/**
 * Container Number Validation (ISO 6346)
 * Format: 4 letters (owner code) + 7 digits (6 serial + 1 check digit)
 * Examples: MSCU1234567, TEMU9876543
 */
export const CONTAINER_NUMBER_REGEX = /^[A-Z]{4}\d{7}$/;

/**
 * Bill of Lading (B/L) Number Validation
 * Format: 4 letters (carrier code) + 8-12 digits
 * Examples: MAEU123456789, COSU12345678
 */
export const BL_NUMBER_REGEX = /^[A-Z]{4}\d{8,12}$/;

/**
 * Air Waybill (AWB) Number Validation
 * Format: 3 digits (airline code) + optional dash + 8 digits
 * Examples: 157-12345678, 07498765432
 */
export const AWB_NUMBER_REGEX = /^\d{3}-?\d{8}$/;

/**
 * Valid shipment types enum
 */
export const VALID_SHIPMENT_TYPES = ['air', 'sea', 'road'] as const;
export type ValidShipmentType = typeof VALID_SHIPMENT_TYPES[number];

// ============================================================================
// VALIDATION RESULT INTERFACES
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validates a container number against ISO 6346 standard
 */
export function validateContainerNumber(containerNumber: string): ValidationResult {
  if (!containerNumber) {
    return { valid: false, error: 'Container number is required' };
  }
  
  const cleaned = containerNumber.trim().toUpperCase().replace(/[\s-]/g, '');
  
  if (!CONTAINER_NUMBER_REGEX.test(cleaned)) {
    return {
      valid: false,
      error: 'Invalid container number format. Must be 4 letters + 7 digits (ISO 6346)'
    };
  }
  
  return { valid: true };
}

/**
 * Validates a Bill of Lading (B/L) number
 */
export function validateBLNumber(blNumber: string): ValidationResult {
  if (!blNumber) {
    return { valid: false, error: 'B/L number is required' };
  }
  
  const cleaned = blNumber.trim().toUpperCase().replace(/[\s-]/g, '');
  
  if (!BL_NUMBER_REGEX.test(cleaned)) {
    return {
      valid: false,
      error: 'Invalid B/L number format. Must be 4 letters + 8-12 digits'
    };
  }
  
  return { valid: true };
}

/**
 * Validates an Air Waybill (AWB) number
 */
export function validateAWBNumber(awbNumber: string): ValidationResult {
  if (!awbNumber) {
    return { valid: false, error: 'AWB number is required' };
  }
  
  const cleaned = awbNumber.trim().replace(/\s/g, '');
  
  if (!AWB_NUMBER_REGEX.test(cleaned)) {
    return {
      valid: false,
      error: 'Invalid AWB number format. Must be XXX-XXXXXXXX'
    };
  }
  
  return { valid: true };
}

/**
 * Validates sea shipment specific data
 * Sea shipments must have at least container_number OR bl_number
 */
export function validateSeaShipment(data: {
  containerNumber?: string;
  blNumber?: string;
}): ValidationResult {
  // Must have at least one identifier
  if (!data.containerNumber && !data.blNumber) {
    return {
      valid: false,
      error: 'Sea shipments must include either container_number or bl_number'
    };
  }
  
  // Validate container number if provided
  if (data.containerNumber) {
    const containerValidation = validateContainerNumber(data.containerNumber);
    if (!containerValidation.valid) {
      return containerValidation;
    }
  }
  
  // Validate B/L number if provided
  if (data.blNumber) {
    const blValidation = validateBLNumber(data.blNumber);
    if (!blValidation.valid) {
      return blValidation;
    }
  }
  
  return { valid: true };
}

/**
 * Validates air shipment specific data
 * Air shipments must have awb_number or tracking_number in AWB format
 */
export function validateAirShipment(data: {
  awbNumber?: string;
  trackingNumber?: string;
}): ValidationResult {
  const numberToValidate = data.awbNumber || data.trackingNumber;
  
  if (!numberToValidate) {
    return {
      valid: false,
      error: 'Air shipments must include awb_number or tracking_number'
    };
  }
  
  // Validate AWB format
  return validateAWBNumber(numberToValidate);
}

/**
 * Validates shipment type is one of the allowed values
 */
export function validateShipmentType(shipmentType: string): ValidationResult {
  if (!VALID_SHIPMENT_TYPES.includes(shipmentType as ValidShipmentType)) {
    return {
      valid: false,
      error: `shipment_type must be one of: ${VALID_SHIPMENT_TYPES.join(', ')}`
    };
  }
  
  return { valid: true };
}

/**
 * Comprehensive shipment validation based on type
 */
export function validateShipment(data: {
  shipmentType: string;
  trackingNumber?: string;
  containerNumber?: string;
  blNumber?: string;
  awbNumber?: string;
}): ValidationResult {
  // Validate tracking number
  if (!data.trackingNumber) {
    return { valid: false, error: 'tracking_number is required' };
  }
  
  // Validate shipment type
  const typeValidation = validateShipmentType(data.shipmentType);
  if (!typeValidation.valid) {
    return typeValidation;
  }
  
  // Type-specific validation
  switch (data.shipmentType) {
    case 'sea':
      return validateSeaShipment({
        containerNumber: data.containerNumber,
        blNumber: data.blNumber
      });
      
    case 'air':
      return validateAirShipment({
        awbNumber: data.awbNumber,
        trackingNumber: data.trackingNumber
      });
      
    case 'road':
      // Road shipments only need tracking number
      return { valid: true };
      
    default:
      return { valid: false, error: 'Unknown shipment type' };
  }
}

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  // Regex patterns
  CONTAINER_NUMBER_REGEX,
  BL_NUMBER_REGEX,
  AWB_NUMBER_REGEX,
  VALID_SHIPMENT_TYPES,
  
  // Validation functions
  validateContainerNumber,
  validateBLNumber,
  validateAWBNumber,
  validateSeaShipment,
  validateAirShipment,
  validateShipmentType,
  validateShipment,
};
