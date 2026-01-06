// app/page.tsx
'use client';

import { useState } from 'react';
import SearchForm from '@/components/SearchForm';
import TrackingResults from '@/components/TrackingResults';
import { TrackingResult, TrackingError } from '@/types/tracking';
import { 
  Ship, 
  Plane, 
  Package, 
  CheckCircle, 
  Clock, 
  Globe, 
  Shield,
  Zap,
  MessageCircle,
  Phone,
  TrendingUp
} from 'lucide-react';

export default function HomePage() {
  const [result, setResult] = useState<TrackingResult | TrackingError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (trackingNumber: string, carrier?: string) => {
    setIsLoading(true);
    setResult(null);

    try {
      const params = new URLSearchParams({
        trackingNumber,
        ...(carrier && { carrier }),
      });

      const response = await fetch(`/api/track?${params.toString()}`);
      const data = await response.json();
      setResult(data);

      // גלילה לתוצאות
      setTimeout(() => {
        const resultsElement = document.getElementById('results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (error) {
      console.error('Search error:', error);
      setResult({
        success: false,
        error: 'שגיאה בחיבור לשרת - נסה שוב מאוחר יותר',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 animated-gradient opacity-10"></div>
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold animate-fade-in-down">
              <Zap className="w-4 h-4" />
              <span>מעקב בזמן אמת • 1,200+ ספקים</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight animate-fade-in-up">
              <span className="gradient-text">יבוא, יצוא ושחרור סחורה</span>
              <br />
              <span className="text-gray-900">שירות מקצועי מקצה לקצה 🚢</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              טיפול מקצועי במכס, ליווי מלא בתהליך היבוא/יצוא + 
              <span className="font-bold text-gray-900"> מעקב משלוחים בזמן אמת</span>
              <br />
              <span className="text-blue-600 font-semibold">ייעוץ ראשוני ללא עלות!</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <a
                href="https://wa.me/9720528420009?text=שלום, אני מעוניין בשירות מקצועי ליבוא/יצוא ושחרור סחורה"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full sm:w-auto flex items-center justify-center gap-3 text-lg shine-effect"
              >
                <MessageCircle className="w-6 h-6" />
                <span>התייעץ עם מומחה</span>
              </a>
              <a
                href="tel:+9720528420009"
                className="btn-outline w-full sm:w-auto flex items-center justify-center gap-3 text-lg"
              >
                <Phone className="w-6 h-6" />
                <span>התקשר עכשיו</span>
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>שירות מקצועי</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                <span>מידע מאובטח</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span>תגובה מהירה</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="container mx-auto px-4 -mt-8 relative z-20">
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />
      </div>

      {/* Results */}
      <div id="results" className="container mx-auto px-4">
        <TrackingResults result={result} />
      </div>

      {/* Why Choose Us Section */}
      {!result && (
        <>
          {/* Features Grid */}
          <div className="container mx-auto px-4 py-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="gradient-text">למה לבחור בנו?</span>
              </h2>
              <p className="text-xl text-gray-600">
                שירות מקצועי עם תמיכה מלאה בכל שלבי התהליך
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Feature 1 */}
              <div className="glass p-8 rounded-2xl card-hover text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-float">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">1,200+ ספקים</h3>
                <p className="text-gray-600">
                  מעקב אחר משלוחים מכל חברות הספנות, התעופה והדואר הגדולות בעולם
                </p>
              </div>

              {/* Feature 2 */}
              <div className="glass p-8 rounded-2xl card-hover text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-float" style={{ animationDelay: '0.5s' }}>
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">טיפול מקצועי במכס</h3>
                <p className="text-gray-600">
                  שחרור סחורה מהיר ויעיל, טיפול במסמכים, ייצוג מול רשויות המכס וחישוב עלויות מראש
                </p>
              </div>

              {/* Feature 3 */}
              <div className="glass p-8 rounded-2xl card-hover text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-float" style={{ animationDelay: '1s' }}>
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">מידע בזמן אמת</h3>
                <p className="text-gray-600">
                  עדכונים מיידיים על מיקום המשלוח שלך עם היסטוריית תנועה מפורטת
                </p>
              </div>

              {/* Feature 4 */}
              <div className="glass p-8 rounded-2xl card-hover text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-float" style={{ animationDelay: '1.5s' }}>
                  <Ship className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">כל סוגי המשלוחים</h3>
                <p className="text-gray-600">
                  ספנות (Container), תעופה, דואר בינלאומי ולוגיסטיקה מקומית
                </p>
              </div>

              {/* Feature 5 */}
              <div className="glass p-8 rounded-2xl card-hover text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-float" style={{ animationDelay: '2s' }}>
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">בטוח ומהימן</h3>
                <p className="text-gray-600">
                  מידע מוצפן ובטוח. אנו לא שומרים נתונים אישיים מעבר למה שנדרש
                </p>
              </div>

              {/* Feature 6 */}
              <div className="glass p-8 rounded-2xl card-hover text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-float" style={{ animationDelay: '2.5s' }}>
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">זמינות 24/7</h3>
                <p className="text-gray-600">
                  המערכת זמינה תמיד, בכל שעה. שלח הודעה ונחזור אליך בהקדם!
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="container mx-auto px-4 py-16">
            <div className="glass max-w-4xl mx-auto rounded-3xl p-12 text-center relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)',
                  backgroundSize: '30px 30px'
                }}></div>
              </div>

              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 pulse-glow">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  <span className="gradient-text">צריך עזרה ביבוא/יצוא?</span>
                </h2>
                
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  אנחנו מטפלים בכל התהליך בשבילך - 
                  <span className="font-bold text-gray-900"> מהזמנה ועד קבלת הסחורה!</span>
                  <br />
                  <span className="text-blue-600 font-semibold text-lg">✓ טיפול במכס ✓ שחרור סחורה ✓ ייעוץ מקצועי</span>
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href="https://wa.me/9720528420009?text=שלום, אני מעוניין בשירות מקצועי ליבוא/יצוא ושחרור סחורה מהמכס"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp w-full sm:w-auto flex items-center justify-center gap-3 text-lg"
                  >
                    <MessageCircle className="w-6 h-6" />
                    <span>שלח הודעה - קבל ייעוץ</span>
                  </a>
                  
                  <a
                    href="tel:+9720528420009"
                    className="btn-outline w-full sm:w-auto flex items-center justify-center gap-3 text-lg"
                  >
                    <Phone className="w-6 h-6" />
                    <span>052-842-0009</span>
                  </a>
                </div>

                <p className="text-sm text-gray-500 mt-6">
                  💼 <strong>שירות מקצועי:</strong> יבוא/יצוא • טיפול במכס • שחרור סחורה • ייעוץ חינם
                </p>
              </div>
            </div>
          </div>

          {/* Services Types */}
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="gradient-text">סוגי משלוחים נתמכים</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="glass p-8 rounded-2xl text-center hover-scale">
                <div className="text-5xl mb-4">🚢</div>
                <h3 className="text-xl font-bold mb-3">ספנות ו-Containers</h3>
                <p className="text-gray-600 mb-4">
                  ZIM, Maersk, MSC, CMA CGM, Hapag-Lloyd, COSCO, Evergreen ועוד
                </p>
                <div className="inline-flex items-center gap-2 text-sm text-blue-600 font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  <span>הנפוץ ביותר ליבוא</span>
                </div>
              </div>

              <div className="glass p-8 rounded-2xl text-center hover-scale">
                <div className="text-5xl mb-4">✈️</div>
                <h3 className="text-xl font-bold mb-3">תעופה ושליחויות</h3>
                <p className="text-gray-600 mb-4">
                  DHL, FedEx, UPS, אל על קרגו ועוד
                </p>
                <div className="inline-flex items-center gap-2 text-sm text-green-600 font-semibold">
                  <Zap className="w-4 h-4" />
                  <span>מהיר ומדויק</span>
                </div>
              </div>

              <div className="glass p-8 rounded-2xl text-center hover-scale">
                <div className="text-5xl mb-4">📮</div>
                <h3 className="text-xl font-bold mb-3">דואר בינלאומי</h3>
                <p className="text-gray-600 mb-4">
                  דואר ישראל, USPS, China Post ועוד
                </p>
                <div className="inline-flex items-center gap-2 text-sm text-purple-600 font-semibold">
                  <Package className="w-4 h-4" />
                  <span>משלוחים קטנים</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
