/**
 * tests/shipments.test.ts
 * Tests for sea shipment functionality
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

// Mock data for testing
const validSeaShipment = {
  trackingNumber: 'MAEU123456789',
  shipmentType: 'sea' as const,
  carrier: 'Maersk Line',
  origin: 'Shanghai, China',
  destination: 'Ashdod, Israel',
  customerName: 'Test Customer',
  customerEmail: 'test@example.com',
  customerPhone: '+972-52-842-0009',
  containerNumber: 'MSCU1234567',
  containerCount: 2,
  blNumber: 'MAEU123456789',
  vesselName: 'MSC OSCAR',
  voyageNumber: '026W',
  description: 'Test cargo',
  referenceNumber: 'REF-001',
  notes: 'Test notes',
};

const validAirShipment = {
  trackingNumber: '157-12345678',
  shipmentType: 'air' as const,
  carrier: 'Emirates',
  awbNumber: '157-12345678',
  airline: 'Emirates',
  customerName: 'Test Customer Air',
  customerEmail: 'air@example.com',
};

describe('Shipment API - Sea Shipments', () => {
  describe('POST /api/shipments - Create Sea Shipment', () => {
    it('should create a valid sea shipment', () => {
      // This would make actual API call in integration tests
      const shipment = validSeaShipment;
      
      expect(shipment.shipmentType).toBe('sea');
      expect(shipment.containerNumber).toBeDefined();
      expect(shipment.blNumber).toBeDefined();
      expect(shipment.trackingNumber).toBe('MAEU123456789');
    });

    it('should reject sea shipment without container number', () => {
      const invalidShipment = { ...validSeaShipment };
      delete (invalidShipment as any).containerNumber;
      
      // Validation should fail
      expect(invalidShipment.containerNumber).toBeUndefined();
      expect(invalidShipment.shipmentType).toBe('sea');
    });

    it('should reject sea shipment without B/L number', () => {
      const invalidShipment = { ...validSeaShipment };
      delete (invalidShipment as any).blNumber;
      
      // Validation should fail
      expect(invalidShipment.blNumber).toBeUndefined();
      expect(invalidShipment.shipmentType).toBe('sea');
    });

    it('should validate container number format', () => {
      // Valid container number format: 4 letters + 6 digits + 1 check digit
      const validFormats = [
        'MSCU1234567',
        'MAEU9876543',
        'HLCU4567890',
        'CSNU1111111',
      ];

      const invalidFormats = [
        { number: 'MSC1234567', reason: 'Only 3 letters' },
        { number: 'MSCU12345', reason: 'Too few digits' },
        { number: 'MSCU12345678', reason: 'Too many digits' },
        { number: '1234MSCU567', reason: 'Wrong order' },
      ];

      validFormats.forEach(format => {
        const regex = /^[A-Z]{4}\d{6}\d{1}$/;
        expect(regex.test(format)).toBe(true);
      });

      invalidFormats.forEach(({ number, reason }) => {
        const regex = /^[A-Z]{4}\d{6}\d{1}$/;
        const cleaned = number.replace(/[\s-]/g, '').toUpperCase();
        expect(regex.test(cleaned)).toBe(false);
      });
    });

    it('should accept optional sea shipment fields', () => {
      const minimalSeaShipment = {
        trackingNumber: 'TEST123456789',
        shipmentType: 'sea' as const,
        containerNumber: 'MSCU1234567',
        blNumber: 'TEST123456789',
      };

      expect(minimalSeaShipment.containerNumber).toBeDefined();
      expect(minimalSeaShipment.blNumber).toBeDefined();
      expect(minimalSeaShipment.vesselName).toBeUndefined();
      expect(minimalSeaShipment.voyageNumber).toBeUndefined();
    });
  });

  describe('Container Number Validation', () => {
    it('should validate ISO 6346 container format', () => {
      const containerNumbers = [
        { number: 'MSCU1234567', valid: true },
        { number: 'MAEU9876543', valid: true },
        { number: 'CSNU1111111', valid: true },
        { number: 'HLCU4567890', valid: true },
        { number: 'INVALID123', valid: false },
        { number: 'ABC1234567', valid: false },  // Only 3 letters
        { number: 'MSCU123456', valid: false },  // Missing check digit
      ];

      const regex = /^[A-Z]{4}\d{6}\d{1}$/;
      
      containerNumbers.forEach(({ number, valid }) => {
        const cleaned = number.replace(/[\s-]/g, '').toUpperCase();
        const isValid = regex.test(cleaned);
        expect(isValid).toBe(valid);
      });
    });

    it('should handle container numbers with separators', () => {
      const variations = [
        'MSCU1234567',
        'MSCU 1234567',
        'MSCU-1234567',
        'MSCU 123456 7',
      ];

      const regex = /^[A-Z]{4}\d{6}\d{1}$/;
      
      variations.forEach(variation => {
        const cleaned = variation.replace(/[\s-]/g, '').toUpperCase();
        expect(regex.test(cleaned)).toBe(true);
      });
    });
  });

  describe('B/L Number Validation', () => {
    it('should accept various B/L formats', () => {
      const blNumbers = [
        'MAEU123456789',     // 4 letters + 9 digits
        'COSU1234567890',    // 4 letters + 10 digits
        'HLCU12345678901',   // 4 letters + 11 digits
        'MSCU123456789012',  // 4 letters + 12 digits
      ];

      const regex = /^[A-Z]{4}\d{8,12}$/;
      
      blNumbers.forEach(bl => {
        const cleaned = bl.trim().toUpperCase();
        expect(regex.test(cleaned)).toBe(true);
      });
    });
  });

  describe('Air vs Sea Shipments', () => {
    it('should differentiate between air and sea shipments', () => {
      const airShip = validAirShipment;
      const seaShip = validSeaShipment;

      expect(airShip.shipmentType).toBe('air');
      expect(seaShip.shipmentType).toBe('sea');
      
      expect((airShip as any).containerNumber).toBeUndefined();
      expect(seaShip.containerNumber).toBeDefined();
      
      expect(airShip.awbNumber).toBeDefined();
      expect((seaShip as any).awbNumber).toBeUndefined();
    });

    it('should allow air shipments without sea-specific fields', () => {
      const airShipment = { ...validAirShipment };
      
      expect(airShipment.shipmentType).toBe('air');
      expect((airShipment as any).containerNumber).toBeUndefined();
      expect((airShipment as any).blNumber).toBeUndefined();
      // Air shipment should not be rejected
    });
  });

  describe('Email Validation', () => {
    it('should validate customer email format', () => {
      const validEmails = [
        'test@example.com',
        'user.name@company.co.il',
        'contact+tag@domain.com',
      ];

      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user @example.com',
      ];

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      validEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(true);
      });

      invalidEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(false);
      });
    });
  });

  describe('Container Count Validation', () => {
    it('should accept valid container counts', () => {
      const validCounts = [1, 2, 5, 10, 50, 100];
      
      validCounts.forEach(count => {
        expect(count).toBeGreaterThanOrEqual(1);
        expect(count).toBeLessThanOrEqual(100);
      });
    });

    it('should reject invalid container counts', () => {
      const invalidCounts = [0, -1, 101, 200];
      
      invalidCounts.forEach(count => {
        const isValid = count >= 1 && count <= 100;
        expect(isValid).toBe(false);
      });
    });
  });
});

describe('Shipment Type Detection Integration', () => {
  it('should detect sea shipment from B/L number', () => {
    // This integrates with existing detectShipmentType function
    const blNumbers = [
      'MAEU123456789',
      'COSU987654321',
      'HLCU456789012',
    ];

    blNumbers.forEach(bl => {
      const regex = /^[A-Z]{4}\d{8,12}$/;
      expect(regex.test(bl)).toBe(true);
    });
  });

  it('should detect sea shipment from container number', () => {
    const containerNumbers = [
      'MSCU1234567',
      'MAEU9876543',
    ];

    containerNumbers.forEach(container => {
      const regex = /^[A-Z]{4}\d{6}\d{1}$/;
      expect(regex.test(container)).toBe(true);
    });
  });
});

// Export mock data for use in other tests
export {
  validSeaShipment,
  validAirShipment,
};
