'use client'

import { useState } from 'react'

export default function TrackingSearch({ 
  onSearch, 
  loading 
}: { 
  onSearch: (trackingNumber: string) => void
  loading: boolean 
}) {
  const [trackingNumber, setTrackingNumber] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (trackingNumber.trim()) {
      onSearch(trackingNumber.trim())
    }
  }

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '0 auto', 
      backgroundColor: 'white', 
      padding: '40px', 
      borderRadius: '20px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
    }}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="הכנס מספר מעקב... (157-12345678, 1Z999AA...)"
          disabled={loading}
          style={{
            width: '100%',
            padding: '20px',
            fontSize: '18px',
            border: '3px solid #e0e0e0',
            borderRadius: '12px',
            marginBottom: '20px',
            outline: 'none'
          }}
        />
        
        <button
          type="submit"
          disabled={loading || !trackingNumber.trim()}
          style={{
            width: '100%',
            padding: '20px',
            fontSize: '20px',
            fontWeight: 'bold',
            backgroundColor: loading ? '#ccc' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '🔍 מחפש...' : '🚀 חפש משלוח'}
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p style={{ color: '#666', fontSize: '14px' }}>דוגמאות:</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '10px' }}>
          {['157-12345678', '1Z999AA10123456784', 'MSCU1234567'].map((example) => (
            <button
              key={example}
              onClick={() => setTrackingNumber(example)}
              style={{
                padding: '8px 12px',
                backgroundColor: '#f0f0f0',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}