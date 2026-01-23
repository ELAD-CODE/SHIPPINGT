export const ShipmentTypes = {
  AIR_WAYBILL: 'air_waybill',
  BILL_OF_LADING: 'bill_of_lading',
  CONTAINER: 'container',
  TRACKING_NUMBER: 'tracking_number',
  UNKNOWN: 'unknown'
};

/**
 * זיהוי סוג המשלוח לפי הפורמט
 */

interface DetectionResult {
  type: string;
  valid: boolean;
  format?: string;
  prefix?: string;
  displayFormat: string;
  carrier?: string | null;
  description: string;
  ownerCode?: string;
  carrierCode?: string;
}

export function detectShipmentType(number: string): DetectionResult {
  if (!number || typeof number !== 'string') {
    return {
      type: ShipmentTypes.UNKNOWN,
      valid: false,
      displayFormat: '',
      carrier: null,
      description: 'קלט לא תקין'
    };
  }
  
  const cleaned = number.trim().replace(/[\s-]/g, '').toUpperCase();
  
  if (cleaned.length === 0) {
    return { type: ShipmentTypes.UNKNOWN, valid: false, displayFormat: '', description: 'מספר חסר' };
  }
  
  // 1. AIR WAYBILL (AWB) - פורמט: XXX-XXXXXXXX או XXXXXXXXXXX
  // דוגמאות: 157-12345678, 02012345678, 074-12345678
  if (/^\d{3}-?\d{8}$/.test(cleaned)) {
    const prefix = cleaned.substring(0, 3);
    return {
      type: ShipmentTypes.AIR_WAYBILL,
      valid: true,
      format: 'standard',
      prefix: prefix,
      displayFormat: `${prefix}-${cleaned.substring(3)}`,
      carrier: getAirlineByPrefix(prefix),
      description: 'שטר מטען אווירי (AWB)'
    };
  }

  // 2. CONTAINER NUMBER - פורמט: XXXX123456-7
  // דוגמאות: MSCU1234567, TEMU9876543
  if (/^[A-Z]{4}\d{6}\d{1}$/.test(cleaned)) {
    const ownerCode = cleaned.substring(0, 4);
    const containerNumber = cleaned.substring(0, 10);
    const providedCheckDigit = cleaned.charAt(10);
    const calculatedCheckDigit = calculateContainerCheckDigit(containerNumber);
    
    return {
      type: ShipmentTypes.CONTAINER,
      valid: calculatedCheckDigit === providedCheckDigit,
      format: 'iso_6346',
      ownerCode: ownerCode,
      displayFormat: `${ownerCode} ${cleaned.substring(4, 10)} ${cleaned.charAt(10)}`,
      carrier: getCarrierByOwnerCode(ownerCode),
      description: 'מכולת שילוח (Container)'
    };
  }

  // 3. BILL OF LADING - פורמטים שונים
  // דוגמאות: MAEU123456789, COSU1234567890, HLCU12345678
  if (/^[A-Z]{4}\d{8,12}$/.test(cleaned)) {
    const carrierCode = cleaned.substring(0, 4);
    return {
      type: ShipmentTypes.BILL_OF_LADING,
      valid: true,
      format: 'carrier_bl',
      carrierCode: carrierCode,
      displayFormat: cleaned,
      carrier: getCarrierByCode(carrierCode),
      description: 'שטר מטען ימי (B/L)'
    };
  }

  // 4. TRACKING NUMBERS - פורמטים שונים של קוריירים
  const trackingPatterns = [
    // DHL: 10-11 ספרות
    { regex: /^\d{10,11}$/, carrier: 'DHL', type: 'express' },
    
    // FedEx: 12-14 ספרות
    { regex: /^\d{12,14}$/, carrier: 'FedEx', type: 'express' },
    
    // UPS: 1Z + 16 תווים
    { regex: /^1Z[A-Z0-9]{16}$/, carrier: 'UPS', type: 'express' },
    
    // USPS: 20-22 ספרות או EA/EC + 9 ספרות + US
    { regex: /^(94|92|93|95)\d{20}$/, carrier: 'USPS', type: 'postal' },
    
    // Israel Post: 2 אותיות + 9 ספרות + IL
    { regex: /^[A-Z]{2}\d{9}IL$/, carrier: 'Israel Post', type: 'postal' },
    
    // China Post/EMS: 13 תווים
    { regex: /^[A-Z]{2}\d{9}[A-Z]{2}$/, carrier: 'China Post/EMS', type: 'postal' },
  ];

  for (const pattern of trackingPatterns) {
    if (pattern.regex.test(cleaned)) {
      return {
        type: ShipmentTypes.TRACKING_NUMBER,
        valid: true,
        format: pattern.type,
        displayFormat: cleaned,
        carrier: pattern.carrier,
        description: `מספר מעקב ${pattern.carrier}`
      };
    }
  }

  // לא זוהה - ננסה בכל זאת
  return {
    type: ShipmentTypes.UNKNOWN,
    valid: false,
    displayFormat: cleaned,
    carrier: null,
    description: 'מספר לא זוהה - ננסה בכל זאת'
  };
}

/**
 * חישוב ספרת ביקורת למכולה (ISO 6346)
 */
function calculateContainerCheckDigit(containerNumber: string): string {
  const values: Record<string, number> = {
    'A': 10, 'B': 12, 'C': 13, 'D': 14, 'E': 15, 'F': 16, 'G': 17,
    'H': 18, 'I': 19, 'J': 20, 'K': 21, 'L': 23, 'M': 24, 'N': 25,
    'O': 26, 'P': 27, 'Q': 28, 'R': 29, 'S': 30, 'T': 31, 'U': 32,
    'V': 34, 'W': 35, 'X': 36, 'Y': 37, 'Z': 38
  };

  let sum = 0;
  for (let i = 0; i < 10; i++) {
    const char = containerNumber[i];
    const value = values[char] || 0;
    sum += value * Math.pow(2, i);
  }

  const checkDigit = (sum % 11) % 10;
  return checkDigit.toString();
}

/**
 * מיפוי קוד חברת תעופה לשם
 */
function getAirlineByPrefix(prefix: string): string {
  const airlines: Record<string, string> = {
    '001': 'American Airlines',
    '005': 'Continental Airlines',
    '006': 'Delta Air Lines',
    '014': 'Air Canada',
    '020': 'Lufthansa',
    '057': 'Air France',
    '074': 'KLM',
    '125': 'British Airways',
    '157': 'Emirates',
    '172': 'Ethiopian Airlines',
    '176': 'El Al',
    '180': 'Korean Air',
    '205': 'Cathay Pacific',
    '214': 'Qantas',
    '235': 'Turkish Airlines',
    '618': 'Cargolux',
    '406': 'FedEx Express',
    '403': 'UPS Airlines'
  };

  return airlines[prefix] || 'Unknown Airline';
}

/**
 * מיפוי קוד בעלים של מכולה לחברת שילוח
 */
function getCarrierByOwnerCode(code: string): string {
  const carriers: Record<string, string> = {
    'MSCU': 'MSC (Mediterranean Shipping Company)',
    'MAEU': 'Maersk Line',
    'CMAU': 'CMA CGM',
    'HLCU': 'Hapag-Lloyd',
    'CSNU': 'COSCO',
    'OOLU': 'OOCL',
    'YMLU': 'Yang Ming',
    'EITU': 'Evergreen',
    'APZU': 'APL',
    'KKFU': 'K Line',
    'MOLU': 'MOL',
    'NYKU': 'NYK Line',
    'ZIMU': 'ZIM',
    'ONEY': 'ONE (Ocean Network Express)',
    'TCLU': 'Turkon Line',
    'MEDU': 'MSC',
    'TEMU': 'MSC',
    'BMOU': 'Hamburg Süd'
  };

  return carriers[code] || 'Unknown Carrier';
}

/**
 * מיפוי קוד חברה ב-B/L לשם חברה
 */
function getCarrierByCode(code: string): string {
  // זהה ל-getCarrierByOwnerCode + נוספים
  return getCarrierByOwnerCode(code);
}

/**
 * פונקציית עזר - האם המספר תקין?
 */
export function isValidShipmentNumber(number: string): boolean {
  const detection = detectShipmentType(number);
  return detection.valid;
}

/**
 * פונקציית עזר - קבל הסבר על הפורמט
 */
export function getFormatExplanation(type: string): {
  title: string;
  format: string;
  example: string;
  explanation: string;
} | null {
  const explanations = {
    [ShipmentTypes.AIR_WAYBILL]: {
      title: 'שטר מטען אווירי (AWB)',
      format: 'XXX-XXXXXXXX',
      example: '157-12345678',
      explanation: 'מורכב מ-3 ספרות (קוד חברת התעופה) ו-8 ספרות (מספר סידורי)'
    },
    [ShipmentTypes.BILL_OF_LADING]: {
      title: 'שטר מטען ימי (Bill of Lading)',
      format: 'XXXXXXXXXXXXXX',
      example: 'MAEU123456789',
      explanation: 'מורכב מקוד חברת הספנות ומספר סידורי'
    },
    [ShipmentTypes.CONTAINER]: {
      title: 'מכולת שילוח (Container)',
      format: 'XXXX-XXXXXX-X',
      example: 'MSCU-123456-7',
      explanation: 'מורכב מ-4 אותיות (קוד בעלים), 6 ספרות ו-1 ספרת ביקורת'
    },
    [ShipmentTypes.TRACKING_NUMBER]: {
      title: 'מספר מעקב',
      format: 'משתנה לפי חברה',
      example: '1Z999AA10123456784',
      explanation: 'פורמט משתנה בהתאם לחברת השילוח'
    }
  };

  return explanations[type] || null;
}

