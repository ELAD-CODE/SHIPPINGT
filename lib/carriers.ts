/**
 * Carrier Detection and Pattern Matching
 * Detects carrier based on tracking number format
 */

import { CarrierPattern } from '@/types/index';

export const CARRIER_PATTERNS: CarrierPattern[] = [
  // Maritime Carriers (Israel-relevant)
  {
    code: 'zim',
    name: 'ZIM',
    nameHebrew: 'זים',
    patterns: [/^ZIMU\d{7}$/i],
    apiCode: 'zim',
  },
  {
    code: 'maersk',
    name: 'Maersk',
    nameHebrew: 'מרסק',
    patterns: [/^MAEU\d{7}$/i, /^MSKU\d{7}$/i],
    apiCode: 'maersk',
  },
  {
    code: 'msc',
    name: 'Mediterranean Shipping Company',
    nameHebrew: 'MSC',
    patterns: [/^MSCU\d{7}$/i],
    apiCode: 'msc',
  },
  {
    code: 'cma-cgm',
    name: 'CMA CGM',
    nameHebrew: 'CMA CGM',
    patterns: [/^CMAU\d{7}$/i],
    apiCode: 'cma-cgm',
  },

  // Parcel Carriers
  {
    code: 'ups',
    name: 'United Parcel Service',
    nameHebrew: 'יופס',
    patterns: [/^1Z[A-Z0-9]{16}$/],
    apiCode: 'ups',
  },
  {
    code: 'fedex',
    name: 'FedEx',
    nameHebrew: 'פדקס',
    patterns: [/^[0-9]{12,14}$/, /^[0-9]{15}$/, /^[0-9]{20}$/],
    apiCode: 'fedex',
  },
  {
    code: 'dhl',
    name: 'Deutsche Post DHL',
    nameHebrew: 'דיאיץ\' אל',
    patterns: [/^\d{10,11}$/, /^[0-9]{4}\s[0-9]{4}\s[0-9]{4}$/],
    apiCode: 'dhl',
  },
  {
    code: 'generic',
    name: 'Generic Tracking',
    nameHebrew: 'מעקב כללי',
    patterns: [/.+/],
    apiCode: 'auto',
  },
];

/**
 * Detect carrier from tracking number
 */
export function detectCarrier(trackingNumber: string): CarrierPattern | null {
  const patterns = CARRIER_PATTERNS.filter((p) => p.code !== 'generic');

  for (const pattern of patterns) {
    for (const regex of pattern.patterns) {
      if (regex.test(trackingNumber)) {
        return pattern;
      }
    }
  }

  return CARRIER_PATTERNS.find((p) => p.code === 'generic') || null;
}

/**
 * Get carrier by code
 */
export function getCarrierByCode(code: string): CarrierPattern | null {
  return CARRIER_PATTERNS.find((p) => p.code === code.toLowerCase()) || null;
}

/**
 * Get all carriers
 */
export function getAllCarriers(): CarrierPattern[] {
  return CARRIER_PATTERNS.filter((p) => p.code !== 'generic');
}
