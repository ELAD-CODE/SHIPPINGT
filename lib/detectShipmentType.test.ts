import { describe, it, expect } from '@jest/globals';
import { detectShipmentType, ShipmentTypes } from './detectShipmentType';

describe('detectShipmentType', () => {
  it('should detect air waybill correctly', () => {
    const result = detectShipmentType('157-12345678');
    expect(result.type).toBe(ShipmentTypes.AIR_WAYBILL);
    expect(result.valid).toBe(true);
  });

  it('should detect container number correctly', () => {
    const result = detectShipmentType('MSCU1234567');
    expect(result.type).toBe(ShipmentTypes.CONTAINER);
    expect(result.valid).toBe(true);
  });

  it('should detect bill of lading correctly', () => {
    const result = detectShipmentType('MAEU123456789');
    expect(result.type).toBe(ShipmentTypes.BILL_OF_LADING);
    expect(result.valid).toBe(true);
  });

  it('should return unknown for invalid shipment number', () => {
    const result = detectShipmentType('invalid');
    expect(result.type).toBe(ShipmentTypes.UNKNOWN);
    expect(result.valid).toBe(false);
  });

  it('should handle empty input', () => {
    const result = detectShipmentType('');
    expect(result.type).toBe(ShipmentTypes.UNKNOWN);
    expect(result.valid).toBe(false);
  });

  it('should normalize whitespace and hyphens', () => {
    const result1 = detectShipmentType('157 12345678');
    const result2 = detectShipmentType('157-12345678');
    expect(result1.type).toBe(ShipmentTypes.AIR_WAYBILL);
    expect(result2.type).toBe(ShipmentTypes.AIR_WAYBILL);
  });
});

// Current order - GOOD (container checked before B/L)
// Keep as-is, more specific patterns first ✅

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts']
};