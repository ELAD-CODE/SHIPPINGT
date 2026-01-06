// components/WhatsAppButton.tsx
'use client';

import { MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // הצג את הכפתור אחרי 2 שניות
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <a
      href="https://wa.me/9720528420009?text=שלום, אני מעוניין במידע על מעקב משלוחים"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 whatsapp-pulse animate-fade-in"
      aria-label="צור קשר בוואטסאפ"
    >
      <div className="relative group">
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-lg whitespace-nowrap shadow-xl">
            יש שאלות? שלח לנו הודעה! 💬
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
              <div className="border-8 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-110 cursor-pointer">
          <MessageCircle className="w-8 h-8 text-white" />
        </div>

        {/* Notification Badge */}
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-pulse">
          1
        </div>
      </div>
    </a>
  );
}
