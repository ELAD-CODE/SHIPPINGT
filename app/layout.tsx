import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Shipment Tracking',
  description: 'Track your shipments',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}