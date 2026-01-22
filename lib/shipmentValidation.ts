/**
 * lib/shipmentValidation.ts
 * ============================================================================
 * Validation utilities for shipment data (air and sea freight)
 */

import {
  ShipmentType,
  CreateShipmentInput,
  ShipmentValidationError,
  ShipmentValidationResult,
} from '@/types/shipment';

/**
 * Validate ISO 6346 container number check digit
 * Format: ABCD1234567 (4 letters + 6 digits + 1 check digit)
 */
export function validateContainerNumber(containerNumber: string): boolean {
  // Remove spaces and convert to uppercase
  const cleaned = containerNumber.replace(/\s/g, '').toUpperCase();
  
  // Check format: 4 letters + 7 digits
  const format = /^[A-Z]{4}\d{7}$/;
  if (!format.test(cleaned)) {
    return false;
  }
  
  // Validate check digit (ISO 6346 algorithm)
  const ownerCode = cleaned.substring(0, 4);
  const serialNumber = cleaned.substring(4, 10);
  const checkDigit = parseInt(cleaned.substring(10, 11), 10);
  
  // Convert letters to numbers (A=10, B=12, C=13, etc.)
  const letterValues: { [key: string]: number } = {
    A: 10, B: 12, C: 13, D: 14, E: 15, F: 16, G: 17, H: 18, I: 19, J: 20,
    K: 21, L: 23, M: 24, N: 25, O: 26, P: 27, Q: 28, R: 29, S: 30, T: 31,
    U: 32, V: 34, W: 35, X: 36, Y: 37, Z: 38,
  };
  
  let sum = 0;
  let position = 0;
  
  // Calculate sum for owner code letters
  for (const char of ownerCode) {
    sum += letterValues[char] * Math.pow(2, position);
    position++;
  }
  
  // Add serial number digits
  for (const digit of serialNumber) {
    sum += parseInt(digit, 10) * Math.pow(2, position);
    position++;
  }
  
  // Calculate check digit
  const calculatedCheckDigit = (sum % 11) % 10;
  
  return calculatedCheckDigit === checkDigit;
}

/**
 * Validate Air Waybill (AWB) format
 * Format: XXX-XXXXXXXX (3-digit airline prefix + 8-digit serial)
 */
export function validateAirWaybill(awb: string): boolean {
  // Remove spaces and hyphens
  const cleaned = awb.replace(/[\s-]/g, '');
  
  // Check if it's 11 digits
  if (!/^\d{11}$/.test(cleaned)) {
    return false;
  }
  
  // First 3 digits should be airline prefix (001-999)
  const airlinePrefix = parseInt(cleaned.substring(0, 3), 10);
  return airlinePrefix >= 1 && airlinePrefix <= 999;
}

/**
 * Validate Bill of Lading format
 * Common formats: MAEU123456789, COSU123456789, etc.
 */
export function validateBillOfLading(bl: string): boolean {
  // Remove spaces
  const cleaned = bl.replace(/\s/g, '').toUpperCase();
  
  // Common B/L format: 4 letters + 8-12 digits
  const format = /^[A-Z]{4}\d{8,12}$/;
  return format.test(cleaned);
}

/**
 * Validate email address
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (international format)
 */
export function validatePhone(phone: string): boolean {
  // Allow +XX format or plain numbers (10-15 digits)
  const phoneRegex = /^(\+\d{1,3})?[\s-]?\(?\d{2,4}\)?[\s-]?\d{3,4}[\s-]?\d{3,4}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate ISO 3166-1 alpha-2 country code
 */
export function validateCountryCode(code: string): boolean {
  // Simple check: 2 uppercase letters
  return /^[A-Z]{2}$/.test(code);
}

/**
 * Validate shipment data based on shipment type
 */
export function validateShipment(input: CreateShipmentInput): ShipmentValidationResult {
  const errors: ShipmentValidationError[] = [];
  
  // Required fields
  if (!input.trackingNumber || input.trackingNumber.trim() === '') {
    errors.push({
      field: 'trackingNumber',
      message: 'Tracking number is required',
      code: 'REQUIRED',
    });
  }
  
  if (!input.shipmentType) {
    errors.push({
      field: 'shipmentType',
      message: 'Shipment type is required',
      code: 'REQUIRED',
    });
  } else if (!Object.values(ShipmentType).includes(input.shipmentType)) {
    errors.push({
      field: 'shipmentType',
      message: `Invalid shipment type. Must be one of: ${Object.values(ShipmentType).join(', ')}`,
      code: 'INVALID_ENUM',
    });
  }
  
  // Email validation (if provided)
  if (input.customerEmail && !validateEmail(input.customerEmail)) {
    errors.push({
      field: 'customerEmail',
      message: 'Invalid email format',
      code: 'INVALID_FORMAT',
    });
  }
  
  // Phone validation (if provided)
  if (input.customerPhone && !validatePhone(input.customerPhone)) {
    errors.push({
      field: 'customerPhone',
      message: 'Invalid phone number format',
      code: 'INVALID_FORMAT',
    });
  }
  
  // Country code validation
  if (input.originCountry && !validateCountryCode(input.originCountry)) {
    errors.push({
      field: 'originCountry',
      message: 'Invalid country code. Use ISO 3166-1 alpha-2 format (e.g., IL, US, CN)',
      code: 'INVALID_FORMAT',
    });
  }
  
  if (input.destinationCountry && !validateCountryCode(input.destinationCountry)) {
    errors.push({
      field: 'destinationCountry',
      message: 'Invalid country code. Use ISO 3166-1 alpha-2 format (e.g., IL, US, CN)',
      code: 'INVALID_FORMAT',
    });
  }
  
  // Type-specific validations
  if (input.shipmentType === ShipmentType.SEA) {
    // Sea freight validations
    if (!input.billOfLading) {
      errors.push({
        field: 'billOfLading',
        message: 'Bill of Lading is required for sea shipments',
        code: 'REQUIRED',
      });
    } else if (!validateBillOfLading(input.billOfLading)) {
      errors.push({
        field: 'billOfLading',
        message: 'Invalid Bill of Lading format',
        code: 'INVALID_FORMAT',
      });
    }
    
    if (input.containerNumber && !validateContainerNumber(input.containerNumber)) {
      errors.push({
        field: 'containerNumber',
        message: 'Invalid container number. Must be ISO 6346 format (e.g., MSCU1234567)',
        code: 'INVALID_FORMAT',
      });
    }
    
    if (input.containerCount && (input.containerCount < 1 || input.containerCount > 100)) {
      errors.push({
        field: 'containerCount',
        message: 'Container count must be between 1 and 100',
        code: 'OUT_OF_RANGE',
      });
    }
  }
  
  if (input.shipmentType === ShipmentType.AIR) {
    // Air freight validations
    if (input.airWaybillNumber && !validateAirWaybill(input.airWaybillNumber)) {
      errors.push({
        field: 'airWaybillNumber',
        message: 'Invalid Air Waybill format. Expected: XXX-XXXXXXXX',
        code: 'INVALID_FORMAT',
      });
    }
  }
  
  // Numeric field validations
  if (input.weight !== undefined && input.weight < 0) {
    errors.push({
      field: 'weight',
      message: 'Weight must be a positive number',
      code: 'OUT_OF_RANGE',
    });
  }
  
  if (input.volume !== undefined && input.volume < 0) {
    errors.push({
      field: 'volume',
      message: 'Volume must be a positive number',
      code: 'OUT_OF_RANGE',
    });
  }
  
  if (input.quantity !== undefined && (input.quantity < 1 || !Number.isInteger(input.quantity))) {
    errors.push({
      field: 'quantity',
      message: 'Quantity must be a positive integer',
      code: 'OUT_OF_RANGE',
    });
  }
  
  if (input.declaredValue !== undefined && input.declaredValue < 0) {
    errors.push({
      field: 'declaredValue',
      message: 'Declared value must be a positive number',
      code: 'OUT_OF_RANGE',
    });
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitize and normalize shipment input
 */
export function sanitizeShipmentInput(input: CreateShipmentInput): CreateShipmentInput {
  const sanitized: CreateShipmentInput = {
    ...input,
    trackingNumber: input.trackingNumber?.trim().toUpperCase(),
    originCountry: input.originCountry?.trim().toUpperCase(),
    destinationCountry: input.destinationCountry?.trim().toUpperCase(),
    originPort: input.originPort?.trim().toUpperCase(),
    destinationPort: input.destinationPort?.trim().toUpperCase(),
    customerEmail: input.customerEmail?.trim().toLowerCase(),
    billOfLading: input.billOfLading?.trim().toUpperCase(),
    containerNumber: input.containerNumber?.trim().toUpperCase().replace(/\s/g, ''),
    // Preserve hyphen in AWB format (XXX-XXXXXXXX)
    airWaybillNumber: input.airWaybillNumber?.trim().replace(/\s+/g, ''),
    currency: input.currency?.trim().toUpperCase() || 'USD',
  };
  
  return sanitized;
}

/**
 * Get validation error message in Hebrew
 */
export function getValidationErrorMessageHe(error: ShipmentValidationError): string {
  const messages: { [key: string]: string } = {
    'trackingNumber.REQUIRED': 'מספר מעקב הוא שדה חובה',
    'shipmentType.REQUIRED': 'סוג משלוח הוא שדה חובה',
    'shipmentType.INVALID_ENUM': 'סוג משלוח לא תקין',
    'customerEmail.INVALID_FORMAT': 'כתובת אימייל לא תקינה',
    'customerPhone.INVALID_FORMAT': 'מספר טלפון לא תקין',
    'originCountry.INVALID_FORMAT': 'קוד מדינה לא תקין',
    'destinationCountry.INVALID_FORMAT': 'קוד מדינה לא תקין',
    'billOfLading.REQUIRED': 'שטר מטען (B/L) הוא שדה חובה למשלוחים ימיים',
    'billOfLading.INVALID_FORMAT': 'פורמט שטר מטען לא תקין',
    'containerNumber.INVALID_FORMAT': 'מספר מכולה לא תקין (פורמט ISO 6346)',
    'containerCount.OUT_OF_RANGE': 'מספר מכולות חייב להיות בין 1 ל-100',
    'airWaybillNumber.INVALID_FORMAT': 'פורמט תעודת משלוח אווירית לא תקין',
    'weight.OUT_OF_RANGE': 'משקל חייב להיות מספר חיובי',
    'volume.OUT_OF_RANGE': 'נפח חייב להיות מספר חיובי',
    'quantity.OUT_OF_RANGE': 'כמות חייבת להיות מספר שלם חיובי',
    'declaredValue.OUT_OF_RANGE': 'ערך מוצהר חייב להיות מספר חיובי',
  };
  
  const key = `${error.field}.${error.code}`;
  return messages[key] || error.message;
}
