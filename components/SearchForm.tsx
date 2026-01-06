// components/SearchForm.tsx
'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { getAllCarriers } from '@/lib/carriers';

interface SearchFormProps {
  onSearch: (trackingNumber: string, carrier?: string) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('auto');
  const carriers = getAllCarriers();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = trackingNumber.trim();
    if (trimmed) {
      onSearch(trimmed, carrier === 'auto' ? undefined : carrier);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="space-y-6">
            {/* Input מספר מעקב */}
            <div>
              <label
                htmlFor="trackingNumber"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                מספר מעקב:
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="trackingNumber"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="לדוגמה: ZIMU1234567, 12345678912345, EL123456789IL"
                  className="w-full px-4 py-3 pr-12 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={isLoading}
                  required
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                הזן מספר מעקב או container number
              </p>
            </div>

            {/* בחירת ספק */}
            <div>
              <label
                htmlFor="carrier"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                סוג משלוח (אופציונלי):
              </label>
              <select
                id="carrier"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={isLoading}
              >
                <option value="auto">🤖 זיהוי אוטומטי</option>
                <optgroup label="ספנות">
                  <option value="zim">🚢 ZIM - צים</option>
                  <option value="maersk">🚢 Maersk</option>
                  <option value="msc">🚢 MSC</option>
                  <option value="cma-cgm">🚢 CMA CGM</option>
                  <option value="hapag-lloyd">🚢 Hapag-Lloyd</option>
                  <option value="cosco">🚢 COSCO</option>
                  <option value="evergreen">🚢 Evergreen</option>
                </optgroup>
                <optgroup label="תעופה">
                  <option value="el-al-cargo">✈️ אל על קרגו</option>
                  <option value="dhl">✈️ DHL</option>
                  <option value="fedex">✈️ FedEx</option>
                  <option value="ups">✈️ UPS</option>
                </optgroup>
                <optgroup label="דואר">
                  <option value="israel-post">📮 דואר ישראל</option>
                  <option value="usps">📮 USPS</option>
                  <option value="china-post">📮 China Post</option>
                </optgroup>
                <optgroup label="לוגיסטיקה ישראלית">
                  <option value="lionwheel">🚚 Lionwheel - ליונוהיל</option>
                  <option value="chita-express">🚚 Chita Express - צ'יטה</option>
                </optgroup>
              </select>
            </div>

            {/* כפתור חיפוש */}
            <button
              type="submit"
              disabled={isLoading || !trackingNumber.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  מחפש את המשלוח שלך...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  חפש משלוח
                </>
              )}
            </button>
          </div>
        </div>

        {/* הדגמה */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            💡 <strong>טיפ:</strong> המערכת מזהה אוטומטית את ספק השילוח לפי מספר המעקב
          </p>
        </div>
      </form>
    </div>
  );
}
