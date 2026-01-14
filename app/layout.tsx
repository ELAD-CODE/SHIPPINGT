import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { Ship, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "מעקב משלוחים בינלאומיים - Shipment Tracking Israel",
  description: "מערכת מעקב משלוחים מקצועית - ספנות, תעופה ודואר. 1,200+ חברות ברחבי העולם.",
  keywords: "מעקב משלוחים, shipment tracking, container tracking, זים, maersk, dhl, fedex",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className="antialiased bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
                <Ship className="w-8 h-8" />
                <span className="text-xl font-bold">מעקב משלוחים</span>
              </Link>

              {/* Navigation */}
              <div className="flex items-center gap-6">
                <Link 
                  href="/" 
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  בית
                </Link>
                <Link 
                  href="/resources" 
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center gap-1"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>משאבים</span>
                </Link>
              </div>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main>
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8 mt-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-400">
              © 2025 מעקב משלוחים בינלאומיים. כל הזכויות שמורות.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Powered by TrackingMore API • 1,200+ Carriers Worldwide
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
