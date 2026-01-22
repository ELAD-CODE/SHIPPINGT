/**
 * Component Types and Interfaces
 */

export interface CTATrigger {
  message: string;
  cta: string;
  urgency: 'critical' | 'high' | 'medium' | 'low';
}

export interface CTAContact {
  phone: string;
  whatsapp: string;
}

export interface CTABoxProps {
  triggers: {
    show_cta: boolean;
    urgency: string;
    triggers: CTATrigger[];
    contact: CTAContact;
  };
  onContactClick: () => void;
}

export interface LeadFormProps {
  trackingNumber: string;
  shipmentType?: string;
  onSubmit: (data: LeadFormData) => void;
  onCancel?: () => void;
}

export interface LeadFormData {
  fullName: string;
  phone: string;
  email: string;
  issue: string;
  notes?: string;
}

export interface ShipmentInfo {
  type: string;
  valid: boolean;
  displayFormat: string;
  description: string;
  carrier?: string | null;
}

export interface TrackingData {
  carrier?: {
    code: string;
    name: string;
    logo?: string;
  };
  status?: {
    code: string;
    text: string;
    text_he?: string;
  };
  origin?: {
    city: string;
    country: string;
  };
  destination?: {
    city: string;
    country: string;
  };
  estimated_delivery?: string;
  timeline?: TrackingEvent[];
  weight?: string;
  pieces?: number;
  shipment_type?: string;
  last_update?: string;
}

export interface TrackingEvent {
  date: string;
  time?: string;
  description: string;
  description_he?: string;
  location: string;
}

export interface TrackingResultProps {
  data: {
    shipment_info: ShipmentInfo;
    tracking_data?: TrackingData;
    cta_triggers?: {
      show_cta: boolean;
      urgency: string;
      triggers: CTATrigger[];
      contact: CTAContact;
    };
  };
  onLeadSubmit?: (data: LeadFormData) => void;
}

export interface TrackingSearchProps {
  onSearch: (trackingNumber: string) => void;
  loading: boolean;
}
