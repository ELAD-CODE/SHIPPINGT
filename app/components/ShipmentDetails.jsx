import React from 'react';
import { 
  Package, MapPin, Clock, Truck, Ship, Plane, CheckCircle, Calendar, 
  Navigation, Download, Mail, MessageSquare, Phone, Brain, AlertTriangle,
  TrendingUp, Zap, Shield
} from 'lucide-react';

const ShipmentDetails = ({ 
  shipment, 
  aiPrediction, 
  riskAssessment, 
  onNewSearch, 
  onDownloadPDF,
  onSendNotification 
}) => {
  const calculateDaysRemaining = (eta) => {
    if (!eta) return null;
    const days = Math.ceil((eta - new Date()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const getStatusColor = (status) => {
    const colors = {
      'completed': 'rgb(34, 197, 94)',
      'current': 'rgb(249, 115, 22)',
      'pending': 'rgb(148, 163, 184)'
    };
    return colors[status] || colors.pending;
  };

  return (
    <div style={{ animation: 'fadeIn 0.6s ease' }}>
      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={onNewSearch}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '10px',
            color: '#38bdf8',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          חיפוש משלוח חדש
        </button>

        <button
          onClick={onDownloadPDF}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          <Download size={16} />
          הורד דוח PDF
        </button>

        <button
          onClick={onSendNotification}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          <Mail size={16} />
          שלח התראה
        </button>
      </div>

      {/* AI Insights Panel */}
      {aiPrediction && riskAssessment && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(124, 58, 237, 0.10) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          boxShadow: '0 10px 30px rgba(139, 92, 246, 0.2)'
        }}>
          <h3 style={{ 
            fontSize: '1.2rem', 
            fontWeight: '700', 
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#f1f5f9'
          }}>
            <Brain size={24} style={{ color: '#a78bfa' }} />
            תובנות AI
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {/* Risk Assessment */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '12px',
              padding: '1.25rem',
              border: `2px solid ${riskAssessment.color}20`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Shield size={20} style={{ color: riskAssessment.color }} />
                <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: '600' }}>הערכת סיכון</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: riskAssessment.color, marginBottom: '0.25rem' }}>
                {riskAssessment.level.toUpperCase()}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                {riskAssessment.text}
              </div>
            </div>

            {/* Delay Probability */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '12px',
              padding: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <AlertTriangle size={20} style={{ color: '#f59e0b' }} />
                <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: '600' }}>סבירות לעיכוב</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b', marginBottom: '0.25rem' }}>
                {Math.round(aiPrediction.probability * 100)}%
              </div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                {aiPrediction.estimatedDelay > 0 
                  ? `צפוי עיכוב של ${aiPrediction.estimatedDelay} ימים`
                  : 'לא צפוי עיכוב'}
              </div>
            </div>

            {/* AI Confidence */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '12px',
              padding: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Zap size={20} style={{ color: '#06b6d4' }} />
                <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: '600' }}>דיוק חיזוי</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#06b6d4', marginBottom: '0.25rem' }}>
                {Math.round(aiPrediction.confidence * 100)}%
              </div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                רמת ביטחון גבוהה
              </div>
            </div>
          </div>

          {/* Weather & Route Analysis */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '10px',
            fontSize: '0.85rem',
            color: '#cbd5e1',
            lineHeight: '1.8'
          }}>
            <strong style={{ color: '#a78bfa' }}>ניתוח גורמים:</strong><br/>
            🌤️ מזג אוויר: {aiPrediction.factors.weather === 'clear' ? 'בהיר, תנאים טובים' : 'סערה צפויה באזור'}<br/>
            🗺️ מסלול: {aiPrediction.factors.route === 'long' ? 'מסלול ארוך (ימי)' : 'מסלול קצר (אווירי)'}<br/>
            📊 התקדמות נוכחית: {aiPrediction.factors.currentProgress}%
          </div>
        </div>
      )}

      {/* Status Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        border: '1px solid rgba(148, 163, 184, 0.15)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: '500' }}>
              מספר מעקב
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f1f5f9', marginBottom: '0.5rem' }}>
              {shipment.id}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
              {shipment.type === 'Air Freight' ? <Plane size={16} /> : <Ship size={16} />}
              {shipment.carrier}
            </div>
          </div>
          <div style={{
            background: 'rgba(249, 115, 22, 0.15)',
            border: '1px solid rgba(249, 115, 22, 0.3)',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#fb923c'
          }}>
            {shipment.status}
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '500' }}>התקדמות משלוח</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#38bdf8' }}>
              {shipment.progress}%
            </div>
          </div>
          <div style={{
            height: '8px',
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${shipment.progress}%`,
              background: 'linear-gradient(90deg, #38bdf8 0%, #0ea5e9 100%)',
              borderRadius: '4px',
              transition: 'width 1s ease',
              boxShadow: '0 0 10px rgba(56, 189, 248, 0.5)'
            }} />
          </div>
        </div>

        {/* Route Info */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginTop: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(148, 163, 184, 0.15)'
        }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: '500' }}>
              נקודת מוצא
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f1f5f9', fontWeight: '600' }}>
              <MapPin size={16} style={{ color: '#38bdf8' }} />
              {shipment.origin}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: '500' }}>
              יעד
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f1f5f9', fontWeight: '600' }}>
              <Navigation size={16} style={{ color: '#38bdf8' }} />
              {shipment.destination}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: '500' }}>
              הגעה משוערת (AI)
            </div>
            {shipment.estimatedArrival ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#22c55e', fontWeight: '600' }}>
                  <Calendar size={16} />
                  {shipment.estimatedArrival.toLocaleDateString('he-IL')}
                </div>
                {calculateDaysRemaining(shipment.estimatedArrival) !== null && (
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.25rem' }}>
                    {calculateDaysRemaining(shipment.estimatedArrival)} ימים נותרו
                  </div>
                )}
              </>
            ) : (
              <div style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: '500' }}>
                מחשב...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Visual Map */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        border: '1px solid rgba(148, 163, 184, 0.15)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
      }}>
        <h3 style={{ 
          fontSize: '1.1rem', 
          fontWeight: '700', 
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#f1f5f9'
        }}>
          <MapPin size={20} style={{ color: '#38bdf8' }} />
          מפת נתיב המשלוח
        </h3>
        <div style={{
          height: '280px',
          background: 'linear-gradient(135deg, #0c1220 0%, #1a2332 100%)',
          borderRadius: '12px',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(148, 163, 184, 0.1)'
        }}>
          <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
            <path
              d={`M 90%,50% Q 70%,20% 50%,50% T 10%,50%`}
              fill="none"
              stroke="rgba(56, 189, 248, 0.3)"
              strokeWidth="3"
              strokeDasharray="5,5"
            />
            <path
              d={`M 90%,50% Q 70%,20% 50%,50% T ${90 - shipment.progress * 0.8}%,50%`}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.6))'
              }}
            />
          </svg>

          {/* Origin */}
          <div style={{
            position: 'absolute',
            left: '90%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#22c55e',
            borderRadius: '50%',
            width: '16px',
            height: '16px',
            border: '3px solid rgba(34, 197, 94, 0.3)',
            boxShadow: '0 0 0 6px rgba(34, 197, 94, 0.1)'
          }} />

          {/* Current Position */}
          <div style={{
            position: 'absolute',
            left: `${90 - shipment.progress * 0.8}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'pulse 2s ease infinite'
          }}>
            <div style={{
              background: '#f97316',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              border: '3px solid rgba(249, 115, 22, 0.3)',
              boxShadow: '0 0 0 8px rgba(249, 115, 22, 0.15), 0 0 20px rgba(249, 115, 22, 0.4)'
            }} />
            {shipment.type === 'Air Freight' ? (
              <Plane size={12} style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                color: 'white'
              }} />
            ) : (
              <Ship size={12} style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                color: 'white'
              }} />
            )}
          </div>

          {/* Destination */}
          <div style={{
            position: 'absolute',
            left: '10%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(56, 189, 248, 0.3)',
            borderRadius: '50%',
            width: '16px',
            height: '16px',
            border: '3px solid rgba(56, 189, 248, 0.5)',
            boxShadow: '0 0 0 6px rgba(56, 189, 248, 0.1)'
          }} />

          {/* Labels */}
          <div style={{
            position: 'absolute',
            left: '90%',
            top: '70%',
            transform: 'translateX(-50%)',
            fontSize: '0.75rem',
            fontWeight: '600',
            color: '#94a3b8',
            textAlign: 'center',
            whiteSpace: 'nowrap'
          }}>
            {shipment.origin.split(',')[0]}
          </div>
          <div style={{
            position: 'absolute',
            left: '10%',
            top: '70%',
            transform: 'translateX(-50%)',
            fontSize: '0.75rem',
            fontWeight: '600',
            color: '#94a3b8',
            textAlign: 'center',
            whiteSpace: 'nowrap'
          }}>
            {shipment.destination.split(',')[0]}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid rgba(148, 163, 184, 0.15)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
      }}>
        <h3 style={{ 
          fontSize: '1.1rem', 
          fontWeight: '700', 
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#f1f5f9'
        }}>
          <Clock size={20} style={{ color: '#38bdf8' }} />
          היסטוריית משלוח
        </h3>
        <div style={{ position: 'relative' }}>
          {shipment.events.map((event, idx) => (
            <div 
              key={idx}
              style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: idx < shipment.events.length - 1 ? '1.5rem' : '0',
                position: 'relative',
                opacity: event.status === 'pending' ? 0.6 : 1,
                animation: `slideInRight ${0.4 + idx * 0.1}s ease`
              }}
            >
              {idx < shipment.events.length - 1 && (
                <div style={{
                  position: 'absolute',
                  left: '1.4rem',
                  top: '2rem',
                  width: '2px',
                  height: 'calc(100% + 1.5rem)',
                  background: event.status === 'completed' 
                    ? 'rgba(56, 189, 248, 0.3)'
                    : 'rgba(148, 163, 184, 0.2)'
                }} />
              )}

              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: event.status === 'completed' 
                  ? 'rgba(34, 197, 94, 0.2)'
                  : event.status === 'current'
                  ? 'rgba(249, 115, 22, 0.2)'
                  : 'rgba(148, 163, 184, 0.1)',
                border: `2px solid ${getStatusColor(event.status)}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: event.status === 'current' ? '0 0 20px rgba(249, 115, 22, 0.4)' : 'none',
                animation: event.status === 'current' ? 'pulse 2s ease infinite' : 'none'
              }}>
                {event.status === 'completed' && <CheckCircle size={20} style={{ color: '#22c55e' }} />}
                {event.status === 'current' && <Truck size={20} style={{ color: '#f97316' }} />}
                {event.status === 'pending' && <Clock size={20} style={{ color: '#94a3b8' }} />}
              </div>

              <div style={{ flex: 1, paddingTop: '0.25rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '0.5rem',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  <div style={{ fontWeight: '600', fontSize: '0.95rem', color: '#f1f5f9' }}>
                    {event.description}
                  </div>
                  <div style={{ 
                    fontSize: '0.8rem', 
                    color: '#94a3b8',
                    fontWeight: '500',
                    whiteSpace: 'nowrap'
                  }}>
                    {event.date} • {event.time}
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.85rem',
                  color: '#cbd5e1'
                }}>
                  <MapPin size={14} style={{ color: '#38bdf8' }} />
                  {event.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetails;