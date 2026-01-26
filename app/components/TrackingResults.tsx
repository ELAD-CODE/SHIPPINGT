'use client';

import { CheckCircle, Clock, AlertCircle, MapPin, Truck } from 'lucide-react';
import type { TrackingResult, TrackingError } from '@/types/index';

interface TrackingResultsProps {
  result: TrackingResult | TrackingError | null;
}

export default function TrackingResults({ result }: TrackingResultsProps) {
  if (!result) {
    return null;
  }

  if (!result.success) {
    const error = result as TrackingError;
    return (
      <div id="results" className="w-full max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-red-50 border-r-4 border-red-500 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h3 className="text-lg font-bold text-red-800">שגיאה</h3>
          </div>
          <p className="text-red-700 mb-2">{error.error}</p>
          {error.details && <p className="text-red-600 text-sm">{error.details}</p>}
        </div>
      </div>
    );
  }

  const data = result as TrackingResult;
  const statusColors: Record<string, { bg: string; text: string; border: string }> = {
    delivered: { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-500' },
    in_transit: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-500' },
    in_warehouse: { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-500' },
    exception: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-500' },
    default: { bg: 'bg-gray-50', text: 'text-gray-800', border: 'border-gray-500' },
  };

  const statusColor =
    statusColors[data.status.code.toLowerCase()] || statusColors.default;

  return (
    <div id="results" className="w-full max-w-4xl mx-auto px-4 mt-8 space-y-6">
      {/* Status Card */}
      <div className={`${statusColor.bg} border-r-4 ${statusColor.border} rounded-lg p-6`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              {data.status.code === 'delivered' ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <Truck className="w-6 h-6 text-blue-600" />
              )}
              <h2 className={`text-2xl font-bold ${statusColor.text}`}>
                {data.status.text}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">מספר מעקב:</p>
                <p className="font-mono text-lg font-semibold">{data.tracking_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">ספק:</p>
                <p className="text-lg font-semibold">{data.carrier.nameHebrew || data.carrier.name}</p>
              </div>
              {data.origin && (
                <div>
                  <p className="text-sm text-gray-600">מקור:</p>
                  <p className="text-lg font-semibold">
                    {data.origin.city}, {data.origin.country}
                  </p>
                </div>
              )}
              {data.destination && (
                <div>
                  <p className="text-sm text-gray-600">יעד:</p>
                  <p className="text-lg font-semibold">
                    {data.destination.city}, {data.destination.country}
                  </p>
                </div>
              )}
            </div>

            {data.estimated_delivery && (
              <div className="mt-4 flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                <p>משעה משוערת להגעה: {data.estimated_delivery}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Events Timeline */}
      {data.events && data.events.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            היסטוריית מעקב
          </h3>

          <div className="space-y-4">
            {data.events.map((event, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-600 mb-2"></div>
                  {index < data.events.length - 1 && (
                    <div className="w-0.5 h-12 bg-gray-200"></div>
                  )}
                </div>
                <div className="pb-6">
                  <p className="font-semibold text-gray-900">{event.status}</p>
                  <p className="text-sm text-gray-600">{event.description}</p>
                  {event.location && (
                    <p className="text-sm text-gray-500 mt-1">📍 {event.location}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
