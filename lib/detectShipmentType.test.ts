import { describe, it, expect } from '@jest/globals';
import { detectShipmentType, ShipmentTypes, isValidShipmentNumber, getFormatExplanation } from './detectShipmentType';

describe('detectShipmentType', () => {
  it('should detect AWB format', () => {
    const result = detectShipmentType('157-12345678');
    expect(result.type).toBe(ShipmentTypes.AIR_WAYBILL);
    expect(result.valid).toBe(true);
    expect(result.carrier).toBe('Emirates');
  });

  it('should detect Container format', () => {
    const result = detectShipmentType('MSCU1234567');
    expect(result.type).toBe(ShipmentTypes.CONTAINER);
  });

  it('should detect Bill of Lading format', () => {
    const result = detectShipmentType('MAEU123456789');
    expect(result.type).toBe(ShipmentTypes.BILL_OF_LADING);
    expect(result.valid).toBe(true);
  });

  it('should return UNKNOWN for invalid shipment number', () => {
    const result = detectShipmentType('invalid_shipment_number');
    expect(result.type).toBe(ShipmentTypes.UNKNOWN);
    expect(result.valid).toBe(false);
  });
});

describe('isValidShipmentNumber', () => {
  it('should return true for a valid AWB', () => {
    const result = isValidShipmentNumber('157-12345678');
    expect(result).toBe(true);
  });

  it('should return false for an invalid shipment number', () => {
    const result = isValidShipmentNumber('invalid_shipment_number');
    expect(result).toBe(false);
  });
});

describe('getFormatExplanation', () => {
  it('should return explanation for AWB', () => {
    const result = getFormatExplanation(ShipmentTypes.AIR_WAYBILL);
    expect(result).not.toBeNull();
    expect(result?.title).toBe('שטר מטען אווירי (AWB)');
  });

  it('should return null for unknown type', () => {
    const result = getFormatExplanation('invalid_type');
    expect(result).toBeNull();
  });
});
