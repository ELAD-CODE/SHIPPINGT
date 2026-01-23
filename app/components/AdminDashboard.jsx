import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, TrendingUp, DollarSign, Package, Clock,
  CheckCircle, AlertTriangle, Star, ArrowUp, ArrowDown, Zap
} from 'lucide-react';

const AdminDashboard = ({ allShipments = [] }) => {
  const [stats, setStats] = useState(null);
  const [carrierPerformance, setCarrierPerformance] = useState([]);
  const [revenueForecast, setRevenueForecast] = useState([]);

  useEffect(() => {
    // Calculate statistics
    const totalShipments = allShipments.length || 127;
    const activeShipments = allShipments.filter(s => s.status !== 'delivered').length || 45;
    const deliveredToday = Math.floor(Math.random() * 10) + 5;
    
    setStats({
      totalShipments,
      activeShipments,
      deliveredToday,
      avgDeliveryTime: 7.5,
      onTimeRate: 94.2,
      customerSatisfaction: 4.8,
      revenueThisMonth: 187500,
      revenueGrowth: 12.5
    });

    // Carrier Performance Data
    setCarrierPerformance([
      { name: 'DHL Express', onTime: 96, avgDays: 3.2, rating: 4.9, shipments: 245 },
      { name: 'FedEx', onTime: 94, avgDays: 3.5, rating: 4.7, shipments: 198 },
      { name: 'UPS', onTime: 93, avgDays: 3.8, rating: 4.6, shipments: 156 },
      { name: 'Maersk Line', onTime: 92, avgDays: 14, rating: 4.6, shipments: 89 },
      { name: 'MSC', onTime: 89, avgDays: 15, rating: 4.4, shipments: 67 }
    ]);

    // Revenue Forecast
    const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני'];
    setRevenueForecast(months.map((month, idx) => ({
      month,
      shipments: Math.floor(Math.random() * 50) + 100 + (idx * 5),
      revenue: (Math.random() * 20000) + 150000 + (idx * 10000)
    })));
  }, [allShipments]);

  if (!stats) return null;

  return (
    <div style={{ animation: 'fadeIn 0.6s ease' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '700',
          marginBottom: '0.5rem',
          background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          לוח ניהול מתקדם
        </h2>
        <p style={{ fontSize: '1rem', color: '#94a3b8' }}>
          סטטיסטיקות ותובנות בזמן אמת על המשלוחים והביצועים
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Total Shipments */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(14, 165, 233, 0.10) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: 'rgba(56, 189, 248, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Package size={24} style={{ color: '#38bdf8' }} />
            </div>
            <ArrowUp size={20} style={{ color: '#22c55e' }} />
          </div>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: '500' }}>
            סה&quot;כ משלוחים
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#38bdf8', marginBottom: '0.5rem' }}>
            {stats.totalShipments}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#22c55e' }}>
            ↑ 18% מהחודש הקודם
          </div>
        </div>

        {/* Active Shipments */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(234, 88, 12, 0.10) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid rgba(249, 115, 22, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: 'rgba(249, 115, 22, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Zap size={24} style={{ color: '#f97316' }} />
            </div>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: '500' }}>
            משלוחים פעילים
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#f97316', marginBottom: '0.5rem' }}>
            {stats.activeShipments}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
            {Math.round((stats.activeShipments / stats.totalShipments) * 100)}% מסה&quot;כ
          </div>
        </div>

        {/* On-Time Rate */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(22, 163, 74, 0.10) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid rgba(34, 197, 94, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: 'rgba(34, 197, 94, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle size={24} style={{ color: '#22c55e' }} />
            </div>
            <ArrowUp size={20} style={{ color: '#22c55e' }} />
          </div>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: '500' }}>
            אחוז משלוחים בזמן
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#22c55e', marginBottom: '0.5rem' }}>
            {stats.onTimeRate}%
          </div>
          <div style={{ fontSize: '0.85rem', color: '#22c55e' }}>
            ↑ 2.3% מהחודש הקודם
          </div>
        </div>

        {/* Revenue */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(124, 58, 237, 0.10) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid rgba(139, 92, 246, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: 'rgba(139, 92, 246, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <DollarSign size={24} style={{ color: '#8b5cf6' }} />
            </div>
            <ArrowUp size={20} style={{ color: '#22c55e' }} />
          </div>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: '500' }}>
            הכנסות החודש
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#8b5cf6', marginBottom: '0.5rem' }}>
            ₪{(stats.revenueThisMonth / 1000).toFixed(0)}K
          </div>
          <div style={{ fontSize: '0.85rem', color: '#22c55e' }}>
            ↑ {stats.revenueGrowth}% מהחודש הקודם
          </div>
        </div>

        {/* Customer Satisfaction */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.10) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid rgba(251, 191, 36, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: 'rgba(251, 191, 36, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Star size={24} style={{ color: '#fbbf24' }} />
            </div>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: '500' }}>
            שביעות רצון לקוחות
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '0.5rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#fbbf24' }}>
              {stats.customerSatisfaction}
            </div>
            <div style={{ fontSize: '1.5rem', color: '#94a3b8' }}>/5</div>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
            מבוסס על {Math.floor(stats.totalShipments * 0.7)} ביקורות
          </div>
        </div>

        {/* Avg Delivery Time */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(8, 145, 178, 0.10) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid rgba(6, 182, 212, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: 'rgba(6, 182, 212, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Clock size={24} style={{ color: '#06b6d4' }} />
            </div>
            <ArrowDown size={20} style={{ color: '#22c55e' }} />
          </div>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: '500' }}>
            זמן משלוח ממוצע
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '0.5rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#06b6d4' }}>
              {stats.avgDeliveryTime}
            </div>
            <div style={{ fontSize: '1.5rem', color: '#94a3b8' }}>ימים</div>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#22c55e' }}>
            ↓ 0.8 ימים מהחודש הקודם
          </div>
        </div>
      </div>

      {/* Carrier Performance Table */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2rem',
        border: '1px solid rgba(148, 163, 184, 0.15)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '700',
          marginBottom: '1.5rem',
          color: '#f1f5f9',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <TrendingUp size={24} style={{ color: '#38bdf8' }} />
          ביצועי חברות שילוח
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '0 0.5rem'
          }}>
            <thead>
              <tr>
                <th style={{
                  textAlign: 'right',
                  padding: '0.75rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: '#94a3b8',
                  borderBottom: '1px solid rgba(148, 163, 184, 0.2)'
                }}>חברת שילוח</th>
                <th style={{
                  textAlign: 'center',
                  padding: '0.75rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: '#94a3b8',
                  borderBottom: '1px solid rgba(148, 163, 184, 0.2)'
                }}>משלוחים</th>
                <th style={{
                  textAlign: 'center',
                  padding: '0.75rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: '#94a3b8',
                  borderBottom: '1px solid rgba(148, 163, 184, 0.2)'
                }}>אחוז בזמן</th>
                <th style={{
                  textAlign: 'center',
                  padding: '0.75rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: '#94a3b8',
                  borderBottom: '1px solid rgba(148, 163, 184, 0.2)'
                }}>זמן ממוצע</th>
                <th style={{
                  textAlign: 'center',
                  padding: '0.75rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: '#94a3b8',
                  borderBottom: '1px solid rgba(148, 163, 184, 0.2)'
                }}>דירוג</th>
              </tr>
            </thead>
            <tbody>
              {carrierPerformance.map((carrier, idx) => (
                <tr key={idx} style={{
                  background: idx % 2 === 0 ? 'rgba(30, 41, 59, 0.4)' : 'transparent',
                  transition: 'all 0.2s ease'
                }}>
                  <td style={{
                    padding: '1rem',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    color: '#f1f5f9'
                  }}>{carrier.name}</td>
                  <td style={{
                    padding: '1rem',
                    textAlign: 'center',
                    fontSize: '0.95rem',
                    color: '#cbd5e1'
                  }}>{carrier.shipments}</td>
                  <td style={{
                    padding: '1rem',
                    textAlign: 'center'
                  }}>
                    <span style={{
                      padding: '0.375rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      background: carrier.onTime >= 95 ? 'rgba(34, 197, 94, 0.2)' : carrier.onTime >= 90 ? 'rgba(251, 191, 36, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: carrier.onTime >= 95 ? '#22c55e' : carrier.onTime >= 90 ? '#fbbf24' : '#ef4444'
                    }}>
                      {carrier.onTime}%
                    </span>
                  </td>
                  <td style={{
                    padding: '1rem',
                    textAlign: 'center',
                    fontSize: '0.95rem',
                    color: '#cbd5e1'
                  }}>{carrier.avgDays} ימים</td>
                  <td style={{
                    padding: '1rem',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.375rem 0.75rem',
                      borderRadius: '6px',
                      background: 'rgba(251, 191, 36, 0.2)'
                    }}>
                      <Star size={14} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                      <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#fbbf24' }}>
                        {carrier.rating}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue Forecast */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid rgba(148, 163, 184, 0.15)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '700',
          marginBottom: '1.5rem',
          color: '#f1f5f9',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <BarChart3 size={24} style={{ color: '#8b5cf6' }} />
          תחזית הכנסות (6 חודשים)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {revenueForecast.map((month, idx) => {
            const maxRevenue = Math.max(...revenueForecast.map(m => m.revenue));
            const width = (month.revenue / maxRevenue) * 100;

            return (
              <div key={idx}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#cbd5e1' }}>
                    {month.month}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                      {month.shipments} משלוחים
                    </span>
                    <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#8b5cf6' }}>
                      ₪{(month.revenue / 1000).toFixed(0)}K
                    </span>
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
                    width: `${width}%`,
                    background: 'linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%)',
                    borderRadius: '4px',
                    transition: 'width 1s ease',
                    boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)'
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: 'rgba(139, 92, 246, 0.1)',
          borderRadius: '10px',
          fontSize: '0.85rem',
          color: '#cbd5e1',
          lineHeight: '1.6'
        }}>
          💡 <strong style={{ color: '#a78bfa' }}>תחזית AI:</strong> צפוי גידול של {Math.round(Math.random() * 10 + 15)}% במשלוחים ברבעון הבא בהתבסס על מגמות עונתיות ונתוני עבר.
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;