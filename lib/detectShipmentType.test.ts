import { describe, it, expect } from '@jest/globals';
import { detectShipmentType, ShipmentTypes } from './detectShipmentType';

describe('detectShipmentType', () => {
  it('should detect AIR_WAYBILL for valid AWB format', () => {
    const awbNumber = '157-12345678';
    const result = detectShipmentType(awbNumber);
    expect(result.type).toBe(ShipmentTypes.AIR_WAYBILL);
    expect(result.valid).toBe(true);
  });
  
  it('should detect CONTAINER for valid container number', () => {
    const containerNumber = 'MSCU1234567';
    const result = detectShipmentType(containerNumber);
    expect(result.type).toBe(ShipmentTypes.CONTAINER);
    expect(result.valid).toBe(true);
  });
  
  it('should detect BILL_OF_LADING for valid B/L number', () => {
    const blNumber = 'MAEU123456789';
    const result = detectShipmentType(blNumber);
    expect(result.type).toBe(ShipmentTypes.BILL_OF_LADING);
    expect(result.valid).toBe(true);
  });

  it('should return UNKNOWN for invalid shipment number', () => {
    const shipmentNumber = 'invalid';
    const result = detectShipmentType(shipmentNumber);
    expect(result.type).toBe(ShipmentTypes.UNKNOWN);
    expect(result.valid).toBe(false);
  });
  
  it('should handle empty string', () => {
    const result = detectShipmentType('');
    expect(result.type).toBe(ShipmentTypes.UNKNOWN);
    expect(result.valid).toBe(false);
  });
});

// Current order - GOOD (container checked before B/L)
// Keep as-is, more specific patterns first ✅