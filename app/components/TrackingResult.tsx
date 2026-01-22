/**
 * קומפוננטת תוצאות מעקב
 * מציגה מידע מלא על המשלוח + טיימליין + CTA
 */

import { useState } from 'react';
import { 
  TruckIcon, 
  MapPinIcon, 
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import CTABox from './CTABox';
import LeadForm from './LeadForm';
import type { TrackingResultProps, LeadFormData } from './types';

export default function TrackingResult({ data, onLeadSubmit }: TrackingResultProps) {
  const [showLeadForm, setShowLeadForm] = useState(false);
  
  if (!data) return null;

  const { shipment_info, tracking_data, cta_triggers } = data;

  // פונקציה לקבלת צבע לפי סטטוס
  const getStatusColor = (status: string | undefined): string => {
    const colors: Record<string, string> = {
      'delivered': 'text-green-600 bg-green-50 border-green-200',
      'in_transit': 'text-blue-600 bg-blue-50 border-blue-200',
      'out_for_delivery': 'text-purple-600 bg-purple-50 border-purple-200',
      'customs': 'text-orange-600 bg-orange-50 border-orange-200',
      'exception': 'text-red-600 bg-red-50 border-red-200',
      'pending': 'text-gray-600 bg-gray-50 border-gray-200',
    };
    return colors[status ?? 'pending'] || colors.pending;
  };

  // פונקציה לקבלת אייקון לפי סטטוס
  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case 'delivered':
        return <CheckCircleIcon className="w-6 h-6" />;
      case 'exception':
        return <ExclamationTriangleIcon className="w-6 h-6" />;
      case 'in_transit':
      case 'out_for_delivery':
        return <TruckIcon className="w-6 h-6" />;
      default:
        return <ClockIcon className="w-6 h-6" />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 mt-8 animate-fadeIn">
      {/* כרטיס ראשי */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        
        {/* Header - מידע בסיסי */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                  {shipment_info.description}
                </span>
                {shipment_info.valid && (
                  <span className="text-xs bg-green-500 px-2 py-1 rounded-full">
                    ✓ תקין
                  </span>
                )}
              </div>
              <h2 className="text-3xl font-bold mb-2" dir="ltr">
                {shipment_info.displayFormat}
              </h2>
              <p className="text-blue-100 text-lg">
                {tracking_data?.carrier?.name || shipment_info.carrier}
              </p>
            </div>
            
            {/* לוגו הקוריר */}
            {tracking_data?.carrier?.logo && (
              <div className="bg-white rounded-lg p-3">
                <img 
                  src={tracking_data.carrier.logo} 
                  alt={tracking_data.carrier.name}
                  className="h-12 w-auto"
                />
              </div>
            )}
          </div>
        </div>

        {/* סטטוס נוכחי */}
        <div className="p-6 border-b border-gray-200">
          <div className={`
            inline-flex items-center gap-3 px-6 py-3 rounded-xl border-2
            ${getStatusColor(tracking_data?.status?.code)}
            font-semibold text-lg
          `}>
            {getStatusIcon(tracking_data?.status?.code)}
            <span>{tracking_data?.status?.text_he || tracking_data?.status?.text}</span>
          </div>
          
          {/* מסלול */}
          {tracking_data && (
            <div className="mt-4 flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-5 h-5" />
                <span className="font-medium">
                  {tracking_data.origin?.city}, {tracking_data.origin?.country}
                </span>
              </div>
              <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
              <TruckIcon className="w-6 h-6 text-blue-600" />
              <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-5 h-5" />
                <span className="font-medium">
                  {tracking_data.destination?.city}, {tracking_data.destination?.country}
                </span>
              </div>
            </div>
          )}

          {/* משלוח מוערך */}
          {tracking_data?.estimated_delivery && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg inline-block">
              <span className="text-sm text-gray-600">משלוח צפוי: </span>
              <span className="font-semibold text-blue-700">
                {new Date(tracking_data.estimated_delivery).toLocaleDateString('he-IL')}
              </span>
            </div>
          )}
        </div>

        {/* CTA Box - אם יש טריגרים */}
        {cta_triggers?.show_cta && !showLeadForm && (
          <CTABox 
            triggers={cta_triggers} 
            onContactClick={() => setShowLeadForm(true)}
          />
        )}

        {/* טופס לידים */}
        {showLeadForm && (
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <LeadForm
              trackingNumber={shipment_info.displayFormat}
              shipmentType={shipment_info.type}
              onSubmit={(leadData) => {
                onLeadSubmit?.(leadData);
                setShowLeadForm(false);
              }}
              onCancel={() => setShowLeadForm(false)}
            />
          </div>
        )}

        {/* טיימליין - היסטוריית המשלוח */}
        {tracking_data?.timeline && tracking_data.timeline.length > 0 && (
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ClockIcon className="w-6 h-6 text-blue-600" />
              היסטוריית משלוח
            </h3>
            
            <div className="relative">
              {/* קו אנכי */}
              <div className="absolute right-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              {/* אירועים */}
              <div className="space-y-4">
                {tracking_data.timeline.map((event, index) => (
                  <div key={index} className="relative pr-12 group">
                    {/* נקודה */}
                    <div className={`
                      absolute right-2.5 w-4 h-4 rounded-full border-2 border-white
                      ${index === 0 
                        ? 'bg-blue-600 ring-4 ring-blue-100' 
                        : 'bg-gray-400 group-hover:bg-blue-500'
                      }
                      transition-colors
                    `}></div>
                    
                    {/* תוכן */}
                    <div className={`
                      p-4 rounded-lg border transition-all
                      ${index === 0
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-gray-50 border-gray-200 group-hover:bg-white'
                      }
                    `}>
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-1">
                            {event.description_he || event.description}
                          </p>
                          <p className="text-sm text-gray-600">
                            📍 {event.location}
                          </p>
                        </div>
                        <div className="text-left" dir="ltr">
                          <p className="text-sm font-medium text-gray-700">
                            {event.date}
                          </p>
                          <p className="text-xs text-gray-500">
                            {event.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* מידע נוסף */}
        {(tracking_data?.weight || tracking_data?.pieces) && (
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {tracking_data.weight && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">משקל</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {tracking_data.weight}
                  </p>
                </div>
              )}
              {tracking_data.pieces && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">חבילות</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {tracking_data.pieces}
                  </p>
                </div>
              )}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">סוג משלוח</p>
                <p className="text-lg font-semibold text-gray-900">
                  {tracking_data.shipment_type === 'air_freight' && '✈️ אווירי'}
                  {tracking_data.shipment_type === 'ocean_freight' && '🚢 ימי'}
                  {tracking_data.shipment_type === 'express' && '📦 מהיר'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">עדכון אחרון</p>
                <p className="text-sm font-medium text-gray-900">
                  {tracking_data.last_update 
                    ? new Date(tracking_data.last_update).toLocaleString('he-IL')
                    : 'אין מידע'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* כפתור חיפוש חדש */}
      <div className="mt-6 text-center">
        <button
          onClick={() => window.location.reload()}
          className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
        >
          ← חזור לחיפוש חדש
        </button>
      </div>
    </div>
  );
}
