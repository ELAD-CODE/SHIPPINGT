import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'מערכת מעקב משלוחים בינלאומית',
  description: 'מעקב משלוחים בינלאומיים עם תמיכה ב-1200+ ספקים ברחבי העולם',
  keywords: [
    'מעקב משלוחים',
    'tracking',
    'shipment',
    'international shipping',
    'trackingmore api',
    'דואר בינלאומי',
  ],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    title: 'מערכת מעקב משלוחים',
    description: 'מעקב משלוחים בינלאומיים בקלות',
    siteName: 'Shipment Tracking',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#0066cc" />
      </head>
      <body className={`${inter.className} bg-gradient-to-b from-gray-50 to-white text-gray-900`}>
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <h1 className="text-2xl md:text-3xl font-bold text-blue-600">
                🌍 מעקב משלוחים בינלאומי
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                עקוב משלוחים בקלות מ-1200+ ספקי שילוח ברחבי העולם
              </p>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 max-w-7xl mx-auto w-full py-8 md:py-16 px-4">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-gray-900 text-gray-300 mt-16">
            <div className="max-w-7xl mx-auto px-4 py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {/* Company Info */}
                <div>
                  <h3 className="text-white font-bold mb-4">אודות המערכת</h3>
                  <p className="text-sm leading-relaxed">
                    מערכת מעקב משלוחים מתקדמת המציעה מעקב בזמן אמת למעל 1200 ספקי שילוח
                    בינלאומיים.
                  </p>
                </div>

                {/* Quick Links */}
                <div>
                  <h3 className="text-white font-bold mb-4">קישורים שימושיים</h3>
                  <ul className="text-sm space-y-2">
                    <li>
                      <a
                        href="#"
                        className="hover:text-blue-400 transition-colors"
                      >
                        עזרה וחיבור קשר
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-blue-400 transition-colors"
                      >
                        תנאי שימוש
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-blue-400 transition-colors"
                      >
                        מדיניות פרטיות
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Contact Info */}
                <div>
                  <h3 className="text-white font-bold mb-4">יצירת קשר</h3>
                  <div className="text-sm space-y-2">
                    <p>📞 052-8420009</p>
                    <p>
                      💬{' '}
                      <a
                        href="https://wa.me/972528420009"
                        className="hover:text-blue-400 transition-colors"
                      >
                        הודעה בוואצאפ
                      </a>
                    </p>
                    <p>📧 support@shipmenttracking.com</p>
                  </div>
                </div>
              </div>

              {/* Powered By */}
              <div className="border-t border-gray-700 pt-8">
                <p className="text-center text-sm">
                  © 2025 מערכת מעקב משלוחים. כל הזכויות שמורות.
                </p>
                <p className="text-center text-xs mt-2 text-gray-500">
                  Powered by TrackingMore API • 1,200+ Carriers Worldwide
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
