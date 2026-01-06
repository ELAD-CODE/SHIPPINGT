// components/TrackingResults.tsx
'use client';

import { TrackingResult, TrackingError } from '@/types/tracking';
import { Package, MapPin, Calendar, Clock, ExternalLink, AlertCircle } from 'lucide-react';

interface TrackingResultsProps {
  result: TrackingResult | TrackingError | null;
}

export default function TrackingResults({ result }: TrackingResultsProps) {
  if (!result) return null;

  // אם יש שגיאה
  if (!result.success) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8 animate-fade-in">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-red-900 mb-2">לא נמצאו תוצאות</h3>
          <p className="text-red-700 text-lg">{result.error}</p>
          {result.trackingNumber && (
            <p className="text-red-600 mt-2 text-sm">מספר מעקב: {result.trackingNumber}</p>
          )}
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            נסה שוב
          </button>
        </div>
      </div>
    );
  }

  // אם יש תוצאה מוצלחת
  const data = result as TrackingResult;
  const carrierLinks: Record<string, string> = {
    'zim': 'https://www.zim.com/tools/track-a-shipment',
    'maersk': 'https://www.maersk.com/tracking/',
    'msc': 'https://www.msc.com/en/track-a-shipment',
    'israel-post': 'https://www.israelpost.co.il/%D7%A9%D7%99%D7%A8%D7%95%D7%AA%D7%99%D7%9D/%D7%9E%D7%A2%D7%A7%D7%91%D7%99%D7%9D/',
    'dhl': 'https://www.dhl.com/il-en/home/tracking.html',
    'fedex': 'https://www.fedex.com/en-il/tracking.html',
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 space-y-6 animate-fade-in">
      {/* כרטיס ראשי */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8" />
              <div>
                <h3 className="text-2xl font-bold">פרטי משלוח</h3>
                <p className="text-blue-100 text-sm">מספר מעקב: {data.tracking_number}</p>
              </div>
            </div>
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
              {data.carrier.nameHebrew || data.carrier.name}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* סטטוס */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{data.status.text.split(' ')[0]}</div>
              <div>
                <p className="text-sm text-gray-600 font-medium">סטטוס נוכחי</p>
                <p className="text-2xl font-bold text-gray-900">{data.status.text}</p>
              </div>
            </div>
          </div>

          {/* מידע כללי */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.origin && (
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-600 font-medium">מוצא</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {data.origin.city || data.origin.country || 'לא ידוע'}
                  </p>
                </div>
              </div>
            )}

            {data.destination && (
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <MapPin className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-600 font-medium">יעד</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {data.destination.city || data.destination.country || 'לא ידוע'}
                  </p>
                </div>
              </div>
            )}

            {data.estimated_delivery && (
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                <Calendar className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-600 font-medium">הגעה משוערת</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(data.estimated_delivery).toLocaleDateString('he-IL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            )}

            {data.days_after_shipping !== undefined && (
              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
                <Clock className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-600 font-medium">זמן מאז משלוח</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {data.days_after_shipping} ימים
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Timeline - היסטוריית אירועים */}
      {data.events && data.events.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-600" />
            היסטוריית משלוח
          </h4>

          <div className="space-y-4 relative before:absolute before:right-2 before:top-0 before:bottom-0 before:w-0.5 before:bg-gray-200">
            {data.events.map((event, index) => {
              const isLatest = index === 0;
              return (
                <div key={index} className="relative pr-8 animate-slide-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <div
                    className={`absolute right-0 top-2 w-4 h-4 rounded-full border-2 ${
                      isLatest
                        ? 'bg-green-500 border-green-300 shadow-lg shadow-green-200'
                        : 'bg-white border-gray-300'
                    }`}
                  />
                  <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{event.status}</p>
                        {event.location && (
                          <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </p>
                        )}
                      </div>
                      <div className="text-left text-sm text-gray-500 whitespace-nowrap">
                        {event.date &&
                          new Date(event.date).toLocaleDateString('he-IL', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* קישורים נוספים */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <h4 className="text-xl font-bold text-gray-900 mb-4">🔗 מידע נוסף</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <a
            href="https://www.shaam.gov.il"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group"
          >
            <span className="text-2xl">🏛️</span>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 group-hover:text-blue-600">בדוק במכס (תס״ק)</p>
              <p className="text-sm text-gray-600">מידע על מסמכים ותשלומים</p>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
          </a>

          {carrierLinks[data.carrier.code] && (
            <a
              href={carrierLinks[data.carrier.code]}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group"
            >
              <span className="text-2xl">🌐</span>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 group-hover:text-purple-600">
                  פרטים באתר {data.carrier.name}
                </p>
                <p className="text-sm text-gray-600">מעקב ישיר מהספק</p>
              </div>
              <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
