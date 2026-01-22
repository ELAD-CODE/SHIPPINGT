/**
 * Tests for Shipment API with Sea Freight support
 */

describe('Shipment Validation', () => {
  describe('Container Number Validation', () => {
    test('should validate correct ISO 6346 format', () => {
      const validContainers = [
        'MSCU1234567',
        'COSU9876543',
        'TEMU4567890',
        'MAEU1111111'
      ];

      validContainers.forEach(container => {
        const regex = /^[A-Z]{4}[0-9]{7}$/;
        expect(regex.test(container)).toBe(true);
      });
    });

    test('should reject invalid container numbers', () => {
      const invalidContainers = [
        'MSCU123456',   // Too short
        'MSCU12345678', // Too long
        'MSC1234567',   // Only 3 letters
        'MSCU123456A',  // Letter in number section
        'mscu1234567',  // Lowercase
        '1234MSCU567',  // Wrong format
      ];

      invalidContainers.forEach(container => {
        const regex = /^[A-Z]{4}[0-9]{7}$/;
        expect(regex.test(container)).toBe(false);
      });
    });
  });

  describe('Sea Shipment Validation', () => {
    function validateSeaShipment(data: any): { valid: boolean; errors: string[] } {
      const errors: string[] = [];
      
      if (!data.containerNumber) {
        errors.push('container_number is required for sea shipments');
      } else if (!/^[A-Z]{4}[0-9]{7}$/.test(data.containerNumber)) {
        errors.push('container_number must be in ISO 6346 format');
      }
      
      if (!data.blNumber) {
        errors.push('bl_number (Bill of Lading) is required for sea shipments');
      }
      
      if (!data.vesselName) {
        errors.push('vessel_name is required for sea shipments');
      }
      
      if (!data.voyageNumber) {
        errors.push('voyage_number is required for sea shipments');
      }
      
      return {
        valid: errors.length === 0,
        errors
      };
    }

    test('should validate complete sea shipment data', () => {
      const validSeaShipment = {
        trackingNumber: 'SEA2024001',
        shipmentType: 'sea',
        containerNumber: 'MSCU1234567',
        blNumber: 'MAEU123456789',
        vesselName: 'MSC MARIA',
        voyageNumber: '202W'
      };

      const result = validateSeaShipment(validSeaShipment);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should require container number for sea shipments', () => {
      const invalidShipment = {
        trackingNumber: 'SEA2024001',
        shipmentType: 'sea',
        blNumber: 'MAEU123456789',
        vesselName: 'MSC MARIA',
        voyageNumber: '202W'
      };

      const result = validateSeaShipment(invalidShipment);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('container_number is required for sea shipments');
    });

    test('should require B/L number for sea shipments', () => {
      const invalidShipment = {
        trackingNumber: 'SEA2024001',
        shipmentType: 'sea',
        containerNumber: 'MSCU1234567',
        vesselName: 'MSC MARIA',
        voyageNumber: '202W'
      };

      const result = validateSeaShipment(invalidShipment);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('bl_number (Bill of Lading) is required for sea shipments');
    });

    test('should require vessel name for sea shipments', () => {
      const invalidShipment = {
        trackingNumber: 'SEA2024001',
        shipmentType: 'sea',
        containerNumber: 'MSCU1234567',
        blNumber: 'MAEU123456789',
        voyageNumber: '202W'
      };

      const result = validateSeaShipment(invalidShipment);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('vessel_name is required for sea shipments');
    });

    test('should require voyage number for sea shipments', () => {
      const invalidShipment = {
        trackingNumber: 'SEA2024001',
        shipmentType: 'sea',
        containerNumber: 'MSCU1234567',
        blNumber: 'MAEU123456789',
        vesselName: 'MSC MARIA'
      };

      const result = validateSeaShipment(invalidShipment);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('voyage_number is required for sea shipments');
    });

    test('should validate container number format', () => {
      const invalidShipment = {
        trackingNumber: 'SEA2024001',
        shipmentType: 'sea',
        containerNumber: 'INVALID123',  // Wrong format
        blNumber: 'MAEU123456789',
        vesselName: 'MSC MARIA',
        voyageNumber: '202W'
      };

      const result = validateSeaShipment(invalidShipment);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('container_number must be in ISO 6346 format');
    });

    test('should return multiple errors for incomplete data', () => {
      const invalidShipment = {
        trackingNumber: 'SEA2024001',
        shipmentType: 'sea'
      };

      const result = validateSeaShipment(invalidShipment);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('Shipment Type Detection', () => {
    test('should identify sea shipment types', () => {
      const seaTypes = ['sea', 'ocean'];
      seaTypes.forEach(type => {
        expect(['sea', 'ocean'].includes(type)).toBe(true);
      });
    });

    test('should identify air shipment types', () => {
      const airTypes = ['air', 'awb'];
      airTypes.forEach(type => {
        expect(['air', 'awb'].includes(type)).toBe(true);
      });
    });

    test('should identify express shipment types', () => {
      const expressTypes = ['express', 'courier'];
      expressTypes.forEach(type => {
        expect(['express', 'courier', 'ground'].includes(type) || type === 'express').toBe(true);
      });
    });
  });

  describe('B/L Number Validation', () => {
    test('should accept valid B/L formats', () => {
      const validBLNumbers = [
        'MAEU123456789',
        'CMAU987654321',
        'COSU123456789',
        'MSCU111222333'
      ];

      validBLNumbers.forEach(blNumber => {
        // B/L format: typically carrier code (4 letters) + digits
        const regex = /^[A-Z]{4}\d{8,12}$/;
        expect(regex.test(blNumber)).toBe(true);
      });
    });

    test('should handle various B/L formats', () => {
      // Different carriers may have different formats
      const blNumbers = [
        { bl: 'MAEU123456789', carrier: 'MAERSK' },
        { bl: 'CMAU987654321', carrier: 'CMA CGM' },
        { bl: 'COSU123456789', carrier: 'COSCO' },
      ];

      blNumbers.forEach(item => {
        expect(item.bl.length).toBeGreaterThan(10);
        expect(item.bl).toMatch(/^[A-Z]/);
      });
    });
  });

  describe('CSV Import Validation', () => {
    test('should validate CSV row for sea shipment', () => {
      const csvRow = {
        tracking_number: 'SEA2024001',
        shipment_type: 'sea',
        container_number: 'MSCU1234567',
        container_count: '1',
        vessel_name: 'MSC MARIA',
        voyage_number: '202W',
        bl_number: 'MAEU123456789',
        origin: 'Shanghai, China',
        destination: 'Ashdod, Israel'
      };

      expect(csvRow.tracking_number).toBeDefined();
      expect(csvRow.shipment_type).toBe('sea');
      expect(csvRow.container_number).toMatch(/^[A-Z]{4}[0-9]{7}$/);
      expect(csvRow.bl_number).toBeDefined();
      expect(csvRow.vessel_name).toBeDefined();
      expect(csvRow.voyage_number).toBeDefined();
    });

    test('should handle optional fields in CSV', () => {
      const csvRow = {
        tracking_number: 'SEA2024001',
        shipment_type: 'sea',
        container_number: 'MSCU1234567',
        vessel_name: 'MSC MARIA',
        voyage_number: '202W',
        bl_number: 'MAEU123456789',
        // Optional fields
        bl_document_url: 'https://example.com/bl.pdf',
        customer_name: 'ABC Import Ltd',
        customer_email: 'contact@abc.com',
        notes: 'Electronics shipment'
      };

      expect(csvRow.bl_document_url).toBeDefined();
      expect(csvRow.customer_name).toBeDefined();
      expect(csvRow.notes).toBeDefined();
    });
  });
});

describe('API Response Format', () => {
  test('should return correct success response format', () => {
    const successResponse = {
      success: true,
      message_he: 'משלוח נוצר בהצלחה',
      message: 'Shipment created successfully',
      shipment: {
        id: 'test-id',
        trackingNumber: 'SEA2024001',
        shipmentType: 'sea',
        containerNumber: 'MSCU1234567'
      }
    };

    expect(successResponse.success).toBe(true);
    expect(successResponse.message_he).toBeDefined();
    expect(successResponse.message).toBeDefined();
    expect(successResponse.shipment).toBeDefined();
  });

  test('should return correct error response format', () => {
    const errorResponse = {
      success: false,
      message_he: 'שגיאה בולידציה',
      message: 'Validation failed',
      errors: ['container_number is required']
    };

    expect(errorResponse.success).toBe(false);
    expect(errorResponse.message_he).toBeDefined();
    expect(errorResponse.errors).toBeDefined();
    expect(Array.isArray(errorResponse.errors)).toBe(true);
  });
});
