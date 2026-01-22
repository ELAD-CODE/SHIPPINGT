import { describe, it, expect } from '@jest/globals';
import {
  CONTAINER_NUMBER_REGEX,
  BL_NUMBER_REGEX,
  AWB_NUMBER_REGEX,
  VALID_SHIPMENT_TYPES,
  validateContainerNumber,
  validateBLNumber,
  validateAWBNumber,
  validateSeaShipment,
  validateAirShipment,
  validateShipmentType
} from '@/lib/shipmentValidation';

/**
 * Tests for sea shipment functionality
 * 
 * Note: These are unit tests that validate business logic.
 * For actual database tests, ensure DATABASE_URL is set to a test database.
 */

describe('Sea Shipment Validation', () => {
  describe('Container Number Validation', () => {
    it('should accept valid ISO 6346 container numbers', () => {
      const validContainerNumbers = [
        'MSCU1234567',
        'TEMU9876543',
        'COSU1111111',
        'MAEU5555555'
      ];
      
      validContainerNumbers.forEach(containerNumber => {
        expect(CONTAINER_NUMBER_REGEX.test(containerNumber)).toBe(true);
        const result = validateContainerNumber(containerNumber);
        expect(result.valid).toBe(true);
      });
    });
    
    it('should reject invalid container numbers', () => {
      const invalidContainerNumbers = [
        'MSC1234567',    // Only 3 letters
        'MSCU123456',    // Only 6 digits
        'MSCU12345678',  // 8 digits
        'MSCUABCDEFG',   // Not numeric
        '1234MSCU567'    // Wrong order
      ];
      
      invalidContainerNumbers.forEach(containerNumber => {
        expect(CONTAINER_NUMBER_REGEX.test(containerNumber)).toBe(false);
        const result = validateContainerNumber(containerNumber);
        expect(result.valid).toBe(false);
      });
    });
  });
  
  describe('Bill of Lading (B/L) Validation', () => {
    it('should accept valid B/L numbers', () => {
      const validBLNumbers = [
        'MAEU123456789',
        'COSU12345678',
        'MSCU123456789012',
        'CMDU987654321'
      ];
      
      validBLNumbers.forEach(blNumber => {
        expect(BL_NUMBER_REGEX.test(blNumber)).toBe(true);
        const result = validateBLNumber(blNumber);
        expect(result.valid).toBe(true);
      });
    });
    
    it('should reject invalid B/L numbers', () => {
      const invalidBLNumbers = [
        'MA123456',           // Too short
        'MAEU1234567',        // Only 7 digits
        'MAEU1234567890123',  // Too many digits
        'MAEUabcdefgh'        // Not numeric
      ];
      
      invalidBLNumbers.forEach(blNumber => {
        expect(BL_NUMBER_REGEX.test(blNumber)).toBe(false);
        const result = validateBLNumber(blNumber);
        expect(result.valid).toBe(false);
      });
    });
  });
  
  describe('Sea Shipment Data Structure', () => {
    it('should have required fields for sea shipment', () => {
      const seaShipment = {
        trackingNumber: 'SEA001',
        shipmentType: 'sea',
        containerNumber: 'MSCU1234567',
        vesselName: 'MAERSK SEALAND',
        voyageNumber: 'V123W',
        blNumber: 'MAEU123456789',
        containerCount: 2
      };
      
      expect(seaShipment.shipmentType).toBe('sea');
      expect(seaShipment.containerNumber).toBeTruthy();
      expect(seaShipment.vesselName).toBeTruthy();
    });
    
    it('should validate sea shipment has at least container or B/L number', () => {
      const validShipment = {
        containerNumber: 'MSCU1234567'
      };
      
      const invalidShipment = {};
      
      expect(validateSeaShipment(validShipment).valid).toBe(true);
      expect(validateSeaShipment(invalidShipment).valid).toBe(false);
    });
  });
  
  describe('Air Waybill (AWB) Validation', () => {
    it('should accept valid AWB numbers', () => {
      const validAWBNumbers = [
        '157-12345678',
        '15712345678',
        '074-98765432',
        '07498765432'
      ];
      
      validAWBNumbers.forEach(awbNumber => {
        expect(AWB_NUMBER_REGEX.test(awbNumber)).toBe(true);
        const result = validateAWBNumber(awbNumber);
        expect(result.valid).toBe(true);
      });
    });
    
    it('should reject invalid AWB numbers', () => {
      const invalidAWBNumbers = [
        '1571234567',     // Too short
        '157-123456789',  // Too long
        'ABC-12345678',   // Not numeric prefix
        '157-ABCDEFGH'    // Not numeric suffix
      ];
      
      invalidAWBNumbers.forEach(awbNumber => {
        expect(AWB_NUMBER_REGEX.test(awbNumber)).toBe(false);
        const result = validateAWBNumber(awbNumber);
        expect(result.valid).toBe(false);
      });
    });
  });
  
  describe('Shipment Type Validation', () => {
    it('should only accept valid shipment types', () => {
      const invalidTypes = ['ocean', 'maritime', 'flight', 'truck'];
      
      VALID_SHIPMENT_TYPES.forEach(type => {
        const result = validateShipmentType(type);
        expect(result.valid).toBe(true);
      });
      
      invalidTypes.forEach(type => {
        const result = validateShipmentType(type);
        expect(result.valid).toBe(false);
      });
    });
  });
});

describe('Shipment API Validation Logic', () => {
  it('should pass validation for valid sea shipment with container', () => {
    const shipment = {
      containerNumber: 'MSCU1234567',
    };
    
    const result = validateSeaShipment(shipment);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });
  
  it('should pass validation for valid sea shipment with B/L', () => {
    const shipment = {
      blNumber: 'MAEU123456789',
    };
    
    const result = validateSeaShipment(shipment);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });
  
  it('should fail validation for sea shipment without container or B/L', () => {
    const shipment = {};
    
    const result = validateSeaShipment(shipment);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('container_number or bl_number');
  });
  
  it('should fail validation for invalid container number format', () => {
    const shipment = {
      containerNumber: 'MSC123456' // Invalid: only 3 letters
    };
    
    const result = validateSeaShipment(shipment);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid container number format');
  });
  
  it('should fail validation for invalid B/L number format', () => {
    const shipment = {
      blNumber: 'MAEU123' // Invalid: too short
    };
    
    const result = validateSeaShipment(shipment);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid B/L number format');
  });
  
  it('should pass validation for valid air shipment', () => {
    const shipment = {
      awbNumber: '157-12345678'
    };
    
    const result = validateAirShipment(shipment);
    expect(result.valid).toBe(true);
  });
  
  it('should fail validation for air shipment without AWB', () => {
    const shipment = {};
    
    const result = validateAirShipment(shipment);
    expect(result.valid).toBe(false);
  });
});

describe('Shipment Creation Examples', () => {
  it('should have correct structure for sea container shipment', () => {
    const seaContainerShipment = {
      trackingNumber: 'CONT001',
      shipmentType: 'sea',
      carrier: 'MAERSK',
      containerNumber: 'MSCU1234567',
      containerType: '40HC',
      containerCount: 2,
      vesselName: 'MAERSK SEALAND',
      voyageNumber: 'V123W',
      portOfLoading: 'CNSHA',
      portOfDischarge: 'ILASH',
      status: 'in_transit'
    };
    
    expect(seaContainerShipment.shipmentType).toBe('sea');
    expect(CONTAINER_NUMBER_REGEX.test(seaContainerShipment.containerNumber)).toBe(true);
    expect(seaContainerShipment.containerCount).toBeGreaterThan(0);
  });
  
  it('should have correct structure for sea B/L shipment', () => {
    const seaBLShipment = {
      trackingNumber: 'BL001',
      shipmentType: 'sea',
      carrier: 'MSC',
      blNumber: 'MSCU123456789',
      vesselName: 'MSC MEDITERRANEAN',
      voyageNumber: '2601E',
      containerCount: 5,
      status: 'at_port'
    };
    
    expect(seaBLShipment.shipmentType).toBe('sea');
    expect(BL_NUMBER_REGEX.test(seaBLShipment.blNumber)).toBe(true);
  });
  
  it('should have correct structure for air AWB shipment', () => {
    const airShipment = {
      trackingNumber: 'AWB001',
      shipmentType: 'air',
      carrier: 'DHL',
      awbNumber: '157-12345678',
      awbPrefix: '157',
      flightNumber: 'LY1234',
      airline: 'EL AL',
      status: 'in_transit'
    };
    
    expect(airShipment.shipmentType).toBe('air');
    expect(AWB_NUMBER_REGEX.test(airShipment.awbNumber)).toBe(true);
  });
});

// Export for use in other test files if needed
export { };
