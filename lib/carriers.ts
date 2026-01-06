// lib/carriers.ts
// זיהוי אוטומטי של ספקי שילוח לפי תבנית מספר המעקב

import { CarrierPattern } from '@/types/tracking';

export const CARRIER_PATTERNS: CarrierPattern[] = [
  // ספנות - Container Tracking
  {
    code: 'zim',
    name: 'ZIM',
    nameHebrew: 'צים',
    patterns: [
      /^ZIMU\d{7}$/i, // ZIMU1234567
      /^[A-Z]{4}\d{7}$/i, // כל container
    ],
    apiCode: 'zim'
  },
  {
    code: 'maersk',
    name: 'Maersk',
    nameHebrew: 'מרסק',
    patterns: [
      /^MAEU\d{7}$/i,
      /^MSKU\d{7}$/i,
    ],
    apiCode: 'maersk'
  },
  {
    code: 'msc',
    name: 'MSC',
    nameHebrew: 'MSC',
    patterns: [
      /^MSCU\d{7}$/i,
      /^MEDU\d{7}$/i,
    ],
    apiCode: 'msc'
  },
  {
    code: 'cma-cgm',
    name: 'CMA CGM',
    nameHebrew: 'CMA CGM',
    patterns: [
      /^CMAU\d{7}$/i,
      /^CGMU\d{7}$/i,
    ],
    apiCode: 'cma-cgm'
  },
  {
    code: 'hapag-lloyd',
    name: 'Hapag-Lloyd',
    nameHebrew: 'האפאג-לויד',
    patterns: [
      /^HLCU\d{7}$/i,
      /^HLXU\d{7}$/i,
    ],
    apiCode: 'hapag-lloyd'
  },
  {
    code: 'cosco',
    name: 'COSCO',
    nameHebrew: 'COSCO',
    patterns: [
      /^COSU\d{7}$/i,
      /^OOCU\d{7}$/i,
    ],
    apiCode: 'cosco'
  },
  {
    code: 'evergreen',
    name: 'Evergreen',
    nameHebrew: 'אברגרין',
    patterns: [
      /^EISU\d{7}$/i,
      /^EGHU\d{7}$/i,
    ],
    apiCode: 'evergreen'
  },

  // דואר ודואר בינלאומי
  {
    code: 'israel-post',
    name: 'Israel Post',
    nameHebrew: 'דואר ישראל',
    patterns: [
      /^E[LAEDC]\d{9}IL$/i, // EL123456789IL
      /^R[RABC]\d{9}IL$/i, // RR123456789IL
      /^C[PCDE]\d{9}IL$/i, // CP123456789IL
    ],
    apiCode: 'israel-post'
  },
  {
    code: 'usps',
    name: 'USPS',
    nameHebrew: 'דואר ארה"ב',
    patterns: [
      /^94\d{20}$/i, // 9400...
      /^92\d{20}$/i, // 9200...
      /^E[A-Z]\d{9}US$/i,
    ],
    apiCode: 'usps'
  },
  {
    code: 'china-post',
    name: 'China Post',
    nameHebrew: 'דואר סין',
    patterns: [
      /^[RLCUE][A-Z]\d{9}CN$/i,
      /^L[A-Z]\d{9}CN$/i,
    ],
    apiCode: 'china-post'
  },

  // שליחויות אוויריות
  {
    code: 'dhl',
    name: 'DHL',
    nameHebrew: 'DHL',
    patterns: [
      /^\d{10}$/i, // 10 ספרות
      /^\d{11}$/i, // 11 ספרות
      /^JD\d{18}$/i, // JD + 18 ספרות
    ],
    apiCode: 'dhl'
  },
  {
    code: 'fedex',
    name: 'FedEx',
    nameHebrew: 'פדקס',
    patterns: [
      /^\d{12}$/i, // 12 ספרות
      /^\d{14}$/i, // 14 ספרות
      /^\d{20}$/i, // 20 ספרות
    ],
    apiCode: 'fedex'
  },
  {
    code: 'ups',
    name: 'UPS',
    nameHebrew: 'UPS',
    patterns: [
      /^1Z[A-Z0-9]{16}$/i, // 1Z + 16 תווים
      /^\d{18}$/i, // 18 ספרות
    ],
    apiCode: 'ups'
  },
  {
    code: 'el-al-cargo',
    name: 'El Al Cargo',
    nameHebrew: 'אל על קרגו',
    patterns: [
      /^ELAL\d{8}$/i,
      /^\d{3}-\d{8}$/i, // 001-12345678
    ],
    apiCode: 'el-al-cargo'
  },

  // לוגיסטיקה ישראלית
  {
    code: 'lionwheel',
    name: 'Lionwheel',
    nameHebrew: 'ליונוהיל',
    patterns: [
      /^LW\d{8,12}$/i,
    ],
    apiCode: 'lionwheel'
  },
  {
    code: 'chita-express',
    name: 'Chita Express',
    nameHebrew: 'צ\'יטה אקספרס',
    patterns: [
      /^CHT\d{8,12}$/i,
    ],
    apiCode: 'chita-express'
  },
];

/**
 * מזהה את ספק השילוח לפי מספר המעקב
 */
export function detectCarrier(trackingNumber: string): CarrierPattern | null {
  const cleanNumber = trackingNumber.trim().toUpperCase();
  
  for (const carrier of CARRIER_PATTERNS) {
    for (const pattern of carrier.patterns) {
      if (pattern.test(cleanNumber)) {
        return carrier;
      }
    }
  }
  
  return null; // לא נמצא
}

/**
 * מחזיר רשימת כל הספקים הזמינים
 */
export function getAllCarriers(): CarrierPattern[] {
  return CARRIER_PATTERNS;
}

/**
 * מחזיר ספק לפי קוד
 */
export function getCarrierByCode(code: string): CarrierPattern | undefined {
  return CARRIER_PATTERNS.find(c => c.code === code || c.apiCode === code);
}

/**
 * תרגום סטטוס לעברית
 */
export function getStatusHebrew(status: string): string {
  const statuses: Record<string, string> = {
    'pending': '⏳ ממתין',
    'transit': '🚢 בדרך',
    'InfoReceived': '📋 מידע התקבל',
    'InTransit': '🌊 בהובלה',
    'OutForDelivery': '🚚 יצא למשלוח',
    'AttemptFail': '⚠️ ניסיון משלוח נכשל',
    'Delivered': '✅ נמסר ליעד',
    'AvailableForPickup': '📦 זמין לאיסוף',
    'Exception': '❌ חריג',
    'Expired': '⌛ פג תוקף',
    'pickup': '📦 נאסף',
    'delivered': '✅ נמסר',
    'undelivered': '❌ לא נמסר',
    'exception': '⚠️ חריג',
  };
  return statuses[status] || status;
}
