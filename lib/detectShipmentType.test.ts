import { describe, it, expect } from '@jest/globals'; // Add this
import { detectShipmentType, ShipmentTypes, isValidShipmentNumber, getFormatExplanation } from './detectShipmentType';

describe('detectShipmentType', () => {
  it('should return the correct shipment type for a valid shipment number', () => {
    const shipmentNumber = '123456789';
    const expectedType = ShipmentTypes.TYPE_A;
    const result = detectShipmentType(shipmentNumber);
    expect(result).toBe(expectedType);
  });

  it('should return null for an invalid shipment number', () => {
    const shipmentNumber = 'invalid_shipment_number';
    const result = detectShipmentType(shipmentNumber);
    expect(result).toBeNull();
  });
});

describe('isValidShipmentNumber', () => {
  it('should return true for a valid shipment number', () => {
    const shipmentNumber = '123456789';
    const result = isValidShipmentNumber(shipmentNumber);
    expect(result).toBe(true);
  });

  it('should return false for an invalid shipment number', () => {
    const shipmentNumber = 'invalid_shipment_number';
    const result = isValidShipmentNumber(shipmentNumber);
    expect(result).toBe(false);
  });
});

describe('getFormatExplanation', () => {
  it('should return the correct format explanation for a valid shipment number', () => {
    const shipmentNumber = '123456789';
    const expectedExplanation = 'Format: 9 digits';
    const result = getFormatExplanation(shipmentNumber);
    expect(result).toBe(expectedExplanation);
  });

  it('should return null for an invalid shipment number', () => {
    const shipmentNumber = 'invalid_shipment_number';
    const result = getFormatExplanation(shipmentNumber);
    expect(result).toBeNull();
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