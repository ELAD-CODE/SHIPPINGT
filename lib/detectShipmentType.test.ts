import { describe, it, expect } from '@jest/globals';
import { detectShipmentType, ShipmentTypes, isValidShipmentNumber, getFormatExplanation } from './detectShipmentType';

describe('detectShipmentType', () => {
  it('should detect Air Waybill (AWB) format', () => {
    const awbNumber = '157-12345678';
    const result = detectShipmentType(awbNumber);
    expect(result.type).toBe(ShipmentTypes.AIR_WAYBILL);
    expect(result.valid).toBe(true);
  });

  it('should detect Container number format', () => {
    const containerNumber = 'MSCU1234567';
    const result = detectShipmentType(containerNumber);
    expect(result.type).toBe(ShipmentTypes.CONTAINER);
    expect(result.valid).toBe(true);
  });

  it('should detect Bill of Lading format', () => {
    const blNumber = 'MAEU123456789';
    const result = detectShipmentType(blNumber);
    expect(result.type).toBe(ShipmentTypes.BILL_OF_LADING);
    expect(result.valid).toBe(true);
  });

  it('should return unknown for invalid shipment number', () => {
    const shipmentNumber = 'invalid_shipment_number';
    const result = detectShipmentType(shipmentNumber);
    expect(result.type).toBe(ShipmentTypes.UNKNOWN);
    expect(result.valid).toBe(false);
  });
});

describe('isValidShipmentNumber', () => {
  it('should return true for a valid AWB number', () => {
    const shipmentNumber = '157-12345678';
    const result = isValidShipmentNumber(shipmentNumber);
    expect(result).toBe(true);
  });

  it('should return true for a valid container number', () => {
    const shipmentNumber = 'MSCU1234567';
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
  it('should return explanation for AWB type', () => {
    const result = getFormatExplanation(ShipmentTypes.AIR_WAYBILL);
    expect(result).not.toBeNull();
    expect(result?.title).toBe('שטר מטען אווירי (AWB)');
    expect(result?.format).toBe('XXX-XXXXXXXX');
  });

  it('should return explanation for Container type', () => {
    const result = getFormatExplanation(ShipmentTypes.CONTAINER);
    expect(result).not.toBeNull();
    expect(result?.title).toBe('מכולת שילוח (Container)');
  });

  it('should return null for unknown type', () => {
    const result = getFormatExplanation('invalid_type');
    expect(result).toBeNull();
  });
});