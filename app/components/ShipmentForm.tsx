/**
 * ShipmentForm Component
 * Form for creating/editing shipments with sea freight support
 */

import { useState } from 'react';

interface ShipmentFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}

interface ShipmentFormData {
  trackingNumber: string;
  shipmentType: 'air' | 'sea' | 'express' | 'ground';
  carrier?: string;
  origin?: string;
  destination?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  // Sea shipment fields
  containerNumber?: string;
  containerCount?: number;
  vesselName?: string;
  voyageNumber?: string;
  blNumber?: string;
  blDocumentUrl?: string;
  // Air shipment fields
  awbNumber?: string;
  flightNumber?: string;
  // General
  nickname?: string;
  notes?: string;
}

export default function ShipmentForm({ initialData, onSubmit, onCancel }: ShipmentFormProps) {
  const [formData, setFormData] = useState<ShipmentFormData>({
    trackingNumber: initialData?.trackingNumber || '',
    shipmentType: initialData?.shipmentType || 'express',
    carrier: initialData?.carrier || '',
    origin: initialData?.origin || '',
    destination: initialData?.destination || '',
    customerName: initialData?.customerName || '',
    customerEmail: initialData?.customerEmail || '',
    customerPhone: initialData?.customerPhone || '',
    containerNumber: initialData?.containerNumber || '',
    containerCount: initialData?.containerCount || 1,
    vesselName: initialData?.vesselName || '',
    voyageNumber: initialData?.voyageNumber || '',
    blNumber: initialData?.blNumber || '',
    blDocumentUrl: initialData?.blDocumentUrl || '',
    awbNumber: initialData?.awbNumber || '',
    flightNumber: initialData?.flightNumber || '',
    nickname: initialData?.nickname || '',
    notes: initialData?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const shipmentTypes = [
    { value: 'express', label: '🚚 Express/Courier', description: 'DHL, FedEx, UPS' },
    { value: 'air', label: '✈️ Air Freight', description: 'Air Waybill (AWB)' },
    { value: 'sea', label: '🚢 Sea/Ocean Freight', description: 'Container & B/L' },
    { value: 'ground', label: '🛻 Ground/Truck', description: 'Land transport' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error if exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!formData.trackingNumber.trim()) {
      newErrors.trackingNumber = 'מספר מעקב הוא שדה חובה';
    }

    // Sea shipment validation
    if (formData.shipmentType === 'sea') {
      if (!formData.containerNumber) {
        newErrors.containerNumber = 'מספר קונטיינר הוא שדה חובה למשלוחים ימיים';
      } else if (!/^[A-Z]{4}[0-9]{7}$/.test(formData.containerNumber)) {
        newErrors.containerNumber = 'מספר קונטיינר לא תקין (פורמט: ABCD1234567)';
      }

      if (!formData.blNumber) {
        newErrors.blNumber = 'מספר B/L (Bill of Lading) הוא שדה חובה';
      }

      if (!formData.vesselName) {
        newErrors.vesselName = 'שם האונייה הוא שדה חובה';
      }

      if (!formData.voyageNumber) {
        newErrors.voyageNumber = 'מספר הפלגה הוא שדה חובה';
      }
    }

    // Email validation
    if (formData.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'כתובת אימייל לא תקינה';
    }

    // Phone validation (Israeli)
    if (formData.customerPhone && !/^05\d{8}$/.test(formData.customerPhone.replace(/[-\s]/g, ''))) {
      newErrors.customerPhone = 'מספר טלפון לא תקין (דוגמה: 0501234567)';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);

    try {
      onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('❌ שגיאה בשליחת הטופס. אנא נסה שוב.');
    } finally {
      setSubmitting(false);
    }
  };

  const isSeaShipment = formData.shipmentType === 'sea';
  const isAirShipment = formData.shipmentType === 'air';

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        {initialData ? '📝 עריכת משלוח' : '➕ הוספת משלוח חדש'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-700 border-b pb-2">מידע בסיסי</h4>

          {/* Tracking Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              מספר מעקב <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="trackingNumber"
              value={formData.trackingNumber}
              onChange={handleChange}
              placeholder="1234567890 או MAEU123456789"
              className={`
                w-full px-4 py-3 rounded-lg border
                ${errors.trackingNumber ? 'border-red-500' : 'border-gray-300'}
                focus:outline-none focus:ring-2 focus:ring-blue-500
                text-right
              `}
            />
            {errors.trackingNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.trackingNumber}</p>
            )}
          </div>

          {/* Shipment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              סוג משלוח <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {shipmentTypes.map(type => (
                <label
                  key={type.value}
                  className={`
                    block p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${formData.shipmentType === type.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 bg-white'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="shipmentType"
                    value={type.value}
                    checked={formData.shipmentType === type.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{type.label.split(' ')[0]}</span>
                    <div className="flex-1 text-right">
                      <div className="font-semibold text-gray-900">
                        {type.label.substring(2)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {type.description}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Carrier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              חברת הובלה (אופציונלי)
            </label>
            <input
              type="text"
              name="carrier"
              value={formData.carrier}
              onChange={handleChange}
              placeholder="DHL, MAERSK, etc."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
            />
          </div>

          {/* Nickname */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שם ידידותי (אופציונלי)
            </label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="למשל: מכולה #1 - אלקטרוניקה"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
            />
          </div>
        </div>

        {/* Sea Shipment Fields */}
        {isSeaShipment && (
          <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-700 border-b border-blue-200 pb-2">
              🚢 פרטי משלוח ימי
            </h4>

            {/* Container Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                מספר קונטיינר <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="containerNumber"
                value={formData.containerNumber}
                onChange={handleChange}
                placeholder="MSCU1234567"
                maxLength={11}
                className={`
                  w-full px-4 py-3 rounded-lg border
                  ${errors.containerNumber ? 'border-red-500' : 'border-gray-300'}
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  font-mono
                `}
                dir="ltr"
              />
              {errors.containerNumber && (
                <p className="mt-1 text-sm text-red-500">{errors.containerNumber}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">פורמט: 4 אותיות + 7 ספרות (ISO 6346)</p>
            </div>

            {/* Container Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                מספר קונטיינרים
              </label>
              <input
                type="number"
                name="containerCount"
                value={formData.containerCount}
                onChange={handleChange}
                min="1"
                max="999"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Vessel Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                שם האונייה <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="vesselName"
                value={formData.vesselName}
                onChange={handleChange}
                placeholder="MSC MARIA"
                className={`
                  w-full px-4 py-3 rounded-lg border
                  ${errors.vesselName ? 'border-red-500' : 'border-gray-300'}
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  text-right
                `}
              />
              {errors.vesselName && (
                <p className="mt-1 text-sm text-red-500">{errors.vesselName}</p>
              )}
            </div>

            {/* Voyage Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                מספר הפלגה <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="voyageNumber"
                value={formData.voyageNumber}
                onChange={handleChange}
                placeholder="202W"
                className={`
                  w-full px-4 py-3 rounded-lg border
                  ${errors.voyageNumber ? 'border-red-500' : 'border-gray-300'}
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                `}
                dir="ltr"
              />
              {errors.voyageNumber && (
                <p className="mt-1 text-sm text-red-500">{errors.voyageNumber}</p>
              )}
            </div>

            {/* B/L Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                מספר B/L (Bill of Lading) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="blNumber"
                value={formData.blNumber}
                onChange={handleChange}
                placeholder="MAEU123456789"
                className={`
                  w-full px-4 py-3 rounded-lg border
                  ${errors.blNumber ? 'border-red-500' : 'border-gray-300'}
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  font-mono
                `}
                dir="ltr"
              />
              {errors.blNumber && (
                <p className="mt-1 text-sm text-red-500">{errors.blNumber}</p>
              )}
            </div>

            {/* B/L Document URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                קישור למסמך B/L (אופציונלי)
              </label>
              <input
                type="url"
                name="blDocumentUrl"
                value={formData.blDocumentUrl}
                onChange={handleChange}
                placeholder="https://example.com/documents/bl.pdf"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                dir="ltr"
              />
            </div>
          </div>
        )}

        {/* Air Shipment Fields */}
        {isAirShipment && (
          <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-700 border-b border-blue-200 pb-2">
              ✈️ פרטי משלוח אווירי
            </h4>

            {/* AWB Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                מספר AWB (Air Waybill)
              </label>
              <input
                type="text"
                name="awbNumber"
                value={formData.awbNumber}
                onChange={handleChange}
                placeholder="157-12345678"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                dir="ltr"
              />
            </div>

            {/* Flight Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                מספר טיסה (אופציונלי)
              </label>
              <input
                type="text"
                name="flightNumber"
                value={formData.flightNumber}
                onChange={handleChange}
                placeholder="LY001"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                dir="ltr"
              />
            </div>
          </div>
        )}

        {/* Location Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-700 border-b pb-2">מיקום</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Origin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                מוצא
              </label>
              <input
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                placeholder="Shanghai, China"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              />
            </div>

            {/* Destination */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                יעד
              </label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="Tel Aviv, Israel"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              />
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-700 border-b pb-2">פרטי לקוח</h4>

          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שם לקוח
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="שם הלקוח"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                אימייל
              </label>
              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleChange}
                placeholder="customer@example.com"
                className={`
                  w-full px-4 py-3 rounded-lg border
                  ${errors.customerEmail ? 'border-red-500' : 'border-gray-300'}
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                `}
                dir="ltr"
              />
              {errors.customerEmail && (
                <p className="mt-1 text-sm text-red-500">{errors.customerEmail}</p>
              )}
            </div>

            {/* Customer Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                טלפון
              </label>
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                placeholder="050-1234567"
                className={`
                  w-full px-4 py-3 rounded-lg border
                  ${errors.customerPhone ? 'border-red-500' : 'border-gray-300'}
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                `}
                dir="ltr"
              />
              {errors.customerPhone && (
                <p className="mt-1 text-sm text-red-500">{errors.customerPhone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            הערות (אופציונלי)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="הערות נוספות על המשלוח"
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-right"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className={`
              flex-1 py-4 rounded-xl font-semibold text-lg
              transition-all duration-200 transform
              ${submitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98]'
              }
              text-white shadow-lg hover:shadow-xl
            `}
          >
            {submitting ? 'שומר...' : (initialData ? 'עדכן משלוח' : 'צור משלוח')}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-4 rounded-xl font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            >
              ביטול
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
