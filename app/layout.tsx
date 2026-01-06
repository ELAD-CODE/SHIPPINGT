// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Phone, Mail, MessageCircle } from "lucide-react";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "🚢 מעקב משלוחים בינלאומיים | שירות מקצועי לעסקים",
  description: "שירות מעקב מקצועי אחר משלוחים בינלאומיים - ספנות, תעופה ודואר. תמיכה מלאה בעברית, 1,200+ חברות שילוח. ייעוץ והכוונה מקצועית.",
  keywords: [
    "מעקב משלוחים",
    "ייבוא",
    "מכס",
    "צים",
    "container tracking",
    "דואר ישראל",
    "משלוחים בינלאומיים",
    "logistics",
    "freight forwarding"
  ],
  authors: [{ name: "Shipment Tracking Israel" }],
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "מעקב משלוחים בינלאומיים - שירות מקצועי",
    description: "עקוב אחר המשלוח שלך בזמן אמת. תמיכה מלאה בעברית, ייעוץ מקצועי.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className="antialiased min-h-screen">
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="glass sticky top-0 z-50 border-b border-white/30">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                {/* Logo & Title */}
                <div className="flex items-center gap-3">
                  <span className="text-5xl animate-float">🚢</span>
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold">
                      <span className="gradient-text">מעקב משלוחים בינלאומיים</span>
                    </h1>
                    <p className="text-sm text-gray-600 hidden md:block">
                      שירות מקצועי לעסקים ויחידים
                    </p>
                  </div>
                </div>

                {/* Contact Info - Desktop */}
                <div className="hidden lg:flex items-center gap-4">
                  <a
                    href="tel:+9720528420009"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-900">052-842-0009</span>
                  </a>
                  <a
                    href="https://wa.me/9720528420009?text=שלום, אני מעוניין במידע על מעקב משלוחים"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp flex items-center gap-2 text-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                {/* Mobile WhatsApp */}
                <a
                  href="https://wa.me/9720528420009?text=שלום, אני מעוניין במידע על מעקב משלוחים"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lg:hidden btn-whatsapp flex items-center gap-2 text-sm py-2 px-4"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>צור קשר</span>
                </a>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="glass border-t border-white/30 mt-20">
            <div className="container mx-auto px-4 py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* About */}
                <div>
                  <h3 className="text-xl font-bold mb-4 gradient-text">אודות השירות</h3>
                  <p className="text-gray-600 leading-relaxed">
                    שירות מעקב מקצועי אחר משלוחים בינלאומיים. 
                    אנו מספקים מידע בזמן אמת על מיקום המשלוח שלכם, 
                    עם תמיכה מלאה בעברית וייעוץ מקצועי.
                  </p>
                </div>

                {/* Quick Links */}
                <div>
                  <h3 className="text-xl font-bold mb-4 gradient-text">קישורים שימושיים</h3>
                  <ul className="space-y-2">
                    <li>
                      <a
                        href="https://www.shaam.gov.il"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        🏛️ תס״ק - מכס ישראל
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.ashdodport.co.il"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        ⚓ נמל אשדוד
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.haifaport.co.il"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        ⚓ נמל חיפה
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Contact */}
                <div>
                  <h3 className="text-xl font-bold mb-4 gradient-text">יצירת קשר</h3>
                  <div className="space-y-3">
                    <a
                      href="tel:+9720528420009"
                      className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-blue-100 group-hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors">
                        <Phone className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">טלפון</p>
                        <p className="font-semibold">052-842-0009</p>
                      </div>
                    </a>

                    <a
                      href="https://wa.me/9720528420009?text=שלום, אני מעוניין במידע על מעקב משלוחים"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-600 hover:text-green-600 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-green-100 group-hover:bg-green-200 rounded-full flex items-center justify-center transition-colors">
                        <MessageCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">WhatsApp</p>
                        <p className="font-semibold">שלח הודעה</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="border-t border-gray-200 mt-8 pt-8 text-center">
                <p className="text-gray-600 text-sm">
                  © {new Date().getFullYear()} מעקב משלוחים בינלאומיים. כל הזכויות שמורות.
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Powered by TrackingMore API | 1,200+ Carriers Worldwide
                </p>
              </div>
            </div>
          </footer>

          {/* Floating WhatsApp Button */}
          <WhatsAppButton />
        </div>
      </body>
    </html>
  );
}
