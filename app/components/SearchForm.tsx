'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import type { CarrierListResponse } from '@/types/index';

interface SearchFormProps {
  onSearch: (trackingNumber: string, carrier?: string) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('auto');
  const [carriers, setCarriers] = useState<any[]>([]);

  // Load carriers on mount
  useEffect(() => {
    const loadCarriers = async () => {
      try {
        const response = await fetch('/api/carriers');
        const data: CarrierListResponse = await response.json();
        if (data.success) {
          setCarriers(data.data);
        }
      } catch (error) {
        console.error('Error loading carriers:', error);
      }
    };

    loadCarriers();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = trackingNumber.trim();
    if (trimmed) {
      onSearch(trimmed, carrier === 'auto' ? undefined : carrier);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
          <div className="space-y-6">
            {/* Tracking Number Input */}
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
                  placeholder="לדוגמה: 1Z999AA10123456784"
                  className="w-full px-4 py-3 pr-12 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all input-field"
                  disabled={isLoading}
                  required
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                הקלד מספר מעקב כלשהו - המערכת תזהה את הספק אוטומטית
              </p>
            </div>

            {/* Carrier Selection */}
            <div>
              <label
                htmlFor="carrier"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                ספק (אופציונלי):
              </label>
              <select
                id="carrier"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all input-field"
                disabled={isLoading}
              >
                <option value="auto">זיהוי אוטומטי</option>
                {carriers.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.nameHebrew || c.name}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-gray-500">
                המערכת תנסה לזהות את הספק אוטומטית אם לא תבחר
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !trackingNumber.trim()}
              className="w-full btn-primary justify-center gap-2 py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  מחפש...
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
      </form>
    </div>
  );
}
