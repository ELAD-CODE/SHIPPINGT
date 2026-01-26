'use client';

import { useState } from 'react';
import { Ship, Plane, Package } from 'lucide-react';
import SearchForm from './components/SearchForm';
import TrackingResults from './components/TrackingResults';
import type { TrackingResponse } from '@/types/index';

export default function HomePage() {
  const [result, setResult] = useState<TrackingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (trackingNumber: string, carrier?: string) => {
    setIsLoading(true);
    setResult(null);

    try {
      const params = new URLSearchParams({
        trackingNumber,
      });

      if (carrier) {
        params.append('carrier', carrier);
      }

      const response = await fetch(`/api/track?${params}`);
      const data: TrackingResponse = await response.json();

      setResult(data);

      // Scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      setResult({
        success: false,
        error: 'שגיאה בחיבור - נסה שוב מאוחר יותר',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-20 md:py-32 rounded-2xl mb-12 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px',
            }}
          ></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-8">
          {/* Icons */}
          <div className="flex justify-center items-center gap-8 mb-6">
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <Ship className="w-12 h-12" />
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <Plane className="w-12 h-12" />
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-full">
              <Package className="w-12 h-12" />
            </div>
          </div>

          {/* Main Heading */}
          <div>
            <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-4">
              עקוב משלוחים בקלות
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              מערכת מעקב משלוחים מתקדמת עם תמיכה ב-1200+ ספקי שילוח בינלאומיים
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-4 border border-white border-opacity-20">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-bold mb-1">זיהוי אוטומטי</h3>
              <p className="text-sm text-blue-100">
                המערכת מזהה את הספק אוטומטית לפי מספר המעקב
              </p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-4 border border-white border-opacity-20">
              <div className="text-3xl mb-2">🌍</div>
              <h3 className="font-bold mb-1">כיסוי עולמי</h3>
              <p className="text-sm text-blue-100">
                תמיכה ב-1200+ ספקים בינלאומיים בכל העולם
              </p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-4 border border-white border-opacity-20">
              <div className="text-3xl mb-2">🔄</div>
              <h3 className="font-bold mb-1">עדכונים בזמן אמת</h3>
              <p className="text-sm text-blue-100">
                קבל עדכונים עדכניים על סטטוס המשלוח שלך
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <SearchForm onSearch={handleSearch} isLoading={isLoading} />

      {/* Results */}
      <TrackingResults result={result} />

      {/* Instructions */}
      {!result && (
        <div className="mt-16 max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <div className="text-2xl font-bold text-blue-600 mb-2">1️⃣</div>
              <h3 className="font-bold text-gray-900 mb-2">הקלד מספר מעקב</h3>
              <p className="text-sm text-gray-600">
                הקלד את מספר המעקב שלך בשדה החיפוש
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <div className="text-2xl font-bold text-green-600 mb-2">2️⃣</div>
              <h3 className="font-bold text-gray-900 mb-2">בחר ספק (אופציונלי)</h3>
              <p className="text-sm text-gray-600">
                בחר את ספק השילוח או השאר זיהוי אוטומטי
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
              <div className="text-2xl font-bold text-purple-600 mb-2">3️⃣</div>
              <h3 className="font-bold text-gray-900 mb-2">קבל תוצאות</h3>
              <p className="text-sm text-gray-600">
                ראה עדכונים מלאים על מעקב המשלוח שלך
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
