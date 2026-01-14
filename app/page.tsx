'use client';

import { useState } from 'react';
import { Search, Ship, Plane, Package, CheckCircle, Clock, Globe } from 'lucide-react';
import type { TrackingResponse } from '@/types/tracking';

export default function HomePage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TrackingResponse | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch(`/api/track?trackingNumber=${encodeURIComponent(trackingNumber)}`);
      const data = await response.json();
      setResult(data);
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      setResult({
        success: false,
        error: 'שגיאה בחיבור - נסה שוב'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section with Background */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-20 md:py-32">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Icons */}
            <div className="flex justify-center items-center gap-8 mb-6">
              <Ship className="w-16 h-16 opacity-80" />
              <Plane className="w-16 h-16 opacity-80" />
              <Package className="w-16 h-16 opacity-80" />
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              מעקב משלוחים בינלאומיים
            </h1>

            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
              1,200+ חברות ספנות, תעופה ודואר במקום אחד
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="mt-10">
              <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 max-w-2xl mx-auto">
                <label htmlFor="tracking" className="block text-gray-700 font-semibold text-right mb-3">
                  הזן מספר מעקב:
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    id="tracking"
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="קונטיינר, B/L, AWB או מספר דואר..."
                    className="flex-1 px-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900 text-right"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !trackingNumber.trim()}
                    className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                  >
                    {isLoading ? (
                      <>
                        <div className="spinner w-5 h-5 border-2"></div>
                        <span>מחפש...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        <span>חפש</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-3 text-right">
                  לדוגמה: ZIMU1234567, 123456789IL, EL123456789IL
                </p>
              </div>
            </form>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm opacity-80 mt-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>מידע מדויק</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>בזמן אמת</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                <span>1,200+ חברות</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div id="results" className="container mx-auto px-4 py-12">
        {result && (
          <div className="max-w-4xl mx-auto">
            {result.success ? (
              <div className="card animate-fade-in">
                {/* Success Result */}
                <div className="border-r-4 border-green-500 pr-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    📦 פרטי משלוח
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <span className="text-gray-600">מספר מעקב:</span>
                      <p className="font-bold text-lg">{result.tracking_number}</p>
                    </div>

                    <div>
                      <span className="text-gray-600">חברה:</span>
                      <p className="font-semibold text-blue-600">{result.carrier.name}</p>
                    </div>

                    <div>
                      <span className="text-gray-600">סטטוס:</span>
                      <p className="font-bold text-lg">{result.status.text}</p>
                    </div>

                    {result.origin && (
                      <div>
                        <span className="text-gray-600">מוצא:</span>
                        <p>🌍 {result.origin.city || result.origin.country}</p>
                      </div>
                    )}

                    {result.destination && (
                      <div>
                        <span className="text-gray-600">יעד:</span>
                        <p>🎯 {result.destination.city || result.destination.country}</p>
                      </div>
                    )}

                    {result.estimated_delivery && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <span className="text-gray-700 font-semibold">הגעה משוערת:</span>
                        <p className="font-bold text-blue-700 text-lg">
                          📅 {new Date(result.estimated_delivery).toLocaleDateString('he-IL')}
                        </p>
                      </div>
                    )}

                    {result.events && result.events.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-bold text-lg mb-3">📜 היסטוריית משלוח:</h3>
                        <div className="space-y-3">
                          {result.events.map((event, index) => (
                            <div key={index} className="border-r-2 border-gray-300 pr-4 pb-3">
                              <div className="text-sm text-gray-500">
                                {new Date(event.date).toLocaleString('he-IL')}
                              </div>
                              <div className="font-semibold">{event.status}</div>
                              {event.location && (
                                <div className="text-sm text-gray-600">📍 {event.location}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="card animate-fade-in border-r-4 border-red-500">
                <h2 className="text-xl font-bold text-red-600 mb-2">⚠️ שגיאה</h2>
                <p className="text-gray-700">{result.error}</p>
                <button
                  onClick={() => setResult(null)}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
                >
                  נסה שוב
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Features Section - Only show when no results */}
      {!result && (
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="card text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">1,200+ חברות</h3>
              <p className="text-gray-600">
                כל חברות הספנות, התעופה והדואר הגדולות בעולם
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">מידע בזמן אמת</h3>
              <p className="text-gray-600">
                עדכונים מיידיים על מיקום המשלוח שלך
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">פשוט ומהיר</h3>
              <p className="text-gray-600">
                הזן מספר מעקב וקבל מידע מיד
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
