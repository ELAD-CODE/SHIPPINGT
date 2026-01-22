'use client'

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '50px auto', color: 'white', textAlign: 'center' }}>
        <h1>🌍 Shipment Tracking</h1>
        <p>API is available at POST /api/track</p>
      </div>
    </main>
  )
}
}