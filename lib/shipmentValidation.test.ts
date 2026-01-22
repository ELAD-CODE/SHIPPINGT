/**
 * lib/shipmentValidation.test.ts
 * ============================================================================
 * Tests for shipment validation utilities
 */

import { describe, it, expect } from '@jest/globals';
import {
  validateContainerNumber,
  validateAirWaybill,
  validateBillOfLading,
  validateEmail,
  validatePhone,
  validateCountryCode,
  validateShipment,
  sanitizeShipmentInput,
} from './shipmentValidation';
import { ShipmentType, CreateShipmentInput } from '@/types/shipment';

describe('Container Number Validation', () => {
  it('should validate correct container numbers', () => {
    expect(validateContainerNumber('MSCU1234567')).toBe(true);
    expect(validateContainerNumber('TEMU9876543')).toBe(true);
  });
  
  it('should reject invalid container numbers', () => {
    expect(validateContainerNumber('INVALID')).toBe(false);
    expect(validateContainerNumber('ABC1234567')).toBe(false); // Wrong check digit
    expect(validateContainerNumber('12345678901')).toBe(false); // All digits
  });
  
  it('should handle container numbers with spaces', () => {
    expect(validateContainerNumber('MSCU 123 456 7')).toBe(true);
  });
});

describe('Air Waybill Validation', () => {
  it('should validate correct AWB numbers', () => {
    expect(validateAirWaybill('157-12345678')).toBe(true);
    expect(validateAirWaybill('074-99999999')).toBe(true);
    expect(validateAirWaybill('15712345678')).toBe(true); // Without hyphen
  });
  
  it('should reject invalid AWB numbers', () => {
    expect(validateAirWaybill('000-12345678')).toBe(false); // Invalid airline prefix
    expect(validateAirWaybill('ABC-12345678')).toBe(false); // Letters
    expect(validateAirWaybill('157-1234567')).toBe(false); // Too short
  });
});

describe('Bill of Lading Validation', () => {
  it('should validate correct B/L numbers', () => {
    expect(validateBillOfLading('MAEU123456789')).toBe(true);
    expect(validateBillOfLading('COSU123456789012')).toBe(true);
    expect(validateBillOfLading('MSCU12345678')).toBe(true);
  });
  
  it('should reject invalid B/L numbers', () => {
    expect(validateBillOfLading('INVALID')).toBe(false);
    expect(validateBillOfLading('1234567890')).toBe(false); // No letters
    expect(validateBillOfLading('MAEU12')).toBe(false); // Too short
  });
});

describe('Email Validation', () => {
  it('should validate correct email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name+tag@example.co.uk')).toBe(true);
  });
  
  it('should reject invalid email addresses', () => {
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('test@')).toBe(false);
  });
});

describe('Phone Validation', () => {
  it('should validate correct phone numbers', () => {
    expect(validatePhone('+972501234567')).toBe(true);
    expect(validatePhone('050-123-4567')).toBe(true);
    expect(validatePhone('0501234567')).toBe(true);
  });
  
  it('should reject invalid phone numbers', () => {
    expect(validatePhone('123')).toBe(false);
    expect(validatePhone('abc')).toBe(false);
  });
});

describe('Country Code Validation', () => {
  it('should validate correct country codes', () => {
    expect(validateCountryCode('IL')).toBe(true);
    expect(validateCountryCode('US')).toBe(true);
    expect(validateCountryCode('CN')).toBe(true);
  });
  
  it('should reject invalid country codes', () => {
    expect(validateCountryCode('il')).toBe(false); // Lowercase
    expect(validateCountryCode('USA')).toBe(false); // 3 letters
    expect(validateCountryCode('1')).toBe(false); // Number
  });
});

describe('Full Shipment Validation', () => {
  it('should validate a valid sea shipment', () => {
    const input: CreateShipmentInput = {
      trackingNumber: 'MAEU123456789',
      shipmentType: ShipmentType.SEA,
      billOfLading: 'MAEU123456789',
      containerNumber: 'MSCU1234567',
      vesselName: 'MSC ISTANBUL',
      voyageNumber: '026W',
      originCountry: 'CN',
      destinationCountry: 'IL',
      containerCount: 1,
    };
    
    const result = validateShipment(input);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
  
  it('should validate a valid air shipment', () => {
    const input: CreateShipmentInput = {
      trackingNumber: '157-12345678',
      shipmentType: ShipmentType.AIR,
      airWaybillNumber: '157-12345678',
      airline: 'El Al',
      originCountry: 'US',
      destinationCountry: 'IL',
    };
    
    const result = validateShipment(input);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
  
  it('should reject shipment with missing required fields', () => {
    const input: CreateShipmentInput = {
      trackingNumber: '',
      shipmentType: ShipmentType.SEA,
    };
    
    const result = validateShipment(input);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
  
  it('should reject sea shipment without Bill of Lading', () => {
    const input: CreateShipmentInput = {
      trackingNumber: 'TEST123',
      shipmentType: ShipmentType.SEA,
      originCountry: 'CN',
      destinationCountry: 'IL',
    };
    
    const result = validateShipment(input);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'billOfLading')).toBe(true);
  });
  
  it('should reject shipment with invalid email', () => {
    const input: CreateShipmentInput = {
      trackingNumber: 'TEST123',
      shipmentType: ShipmentType.EXPRESS,
      customerEmail: 'invalid-email',
    };
    
    const result = validateShipment(input);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'customerEmail')).toBe(true);
  });
  
  it('should reject shipment with invalid container number', () => {
    const input: CreateShipmentInput = {
      trackingNumber: 'TEST123',
      shipmentType: ShipmentType.SEA,
      billOfLading: 'MAEU123456789',
      containerNumber: 'INVALID123',
      originCountry: 'CN',
      destinationCountry: 'IL',
    };
    
    const result = validateShipment(input);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.field === 'containerNumber')).toBe(true);
  });
});

describe('Input Sanitization', () => {
  it('should sanitize and normalize input', () => {
    const input: CreateShipmentInput = {
      trackingNumber: '  maeu123456789  ',
      shipmentType: ShipmentType.SEA,
      billOfLading: ' maeu123456789 ',
      containerNumber: ' MSCU 123 456 7 ',
      originCountry: 'cn',
      destinationCountry: 'il',
      customerEmail: ' TEST@EXAMPLE.COM ',
    };
    
    const sanitized = sanitizeShipmentInput(input);
    
    expect(sanitized.trackingNumber).toBe('MAEU123456789');
    expect(sanitized.billOfLading).toBe('MAEU123456789');
    expect(sanitized.containerNumber).toBe('MSCU1234567');
    expect(sanitized.originCountry).toBe('CN');
    expect(sanitized.destinationCountry).toBe('IL');
    expect(sanitized.customerEmail).toBe('test@example.com');
  });
});
